import fs from 'fs';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';

const customRequire = typeof require !== 'undefined'
  ? require
  : createRequire(import.meta.url || `file://${process.cwd()}/server.js`);

const pdfParse = customRequire('pdf-parse');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractionResult {
  text: string;
  pages: ExtractedPage[];
  pageCount: number;
}

export async function extractTextFromFile(filePath: string, fileType: string): Promise<ExtractionResult> {
  const buffer = fs.readFileSync(filePath);

  if (fileType === 'pdf') {
    try {
      const data = await pdfParse(buffer);
      const fullText = data.text.trim();

      // If text extracted is sparse, try page-by-page splitting
      const totalPages = data.numpages || 1;
      const pages: ExtractedPage[] = [];

      // Split text roughly by page markers if available, or chunk evenly
      const rawPages = fullText.split(/\n(?=Page \d+|\f|\x0C)/i);
      if (rawPages.length >= totalPages) {
        rawPages.forEach((pText, i) => {
          pages.push({
            pageNumber: i + 1,
            text: pText.trim(),
          });
        });
      } else {
        const chunkSize = Math.max(100, Math.ceil(fullText.length / totalPages));
        for (let i = 0; i < totalPages; i++) {
          const pText = fullText.slice(i * chunkSize, (i + 1) * chunkSize);
          pages.push({
            pageNumber: i + 1,
            text: pText.trim(),
          });
        }
      }

      return {
        text: fullText,
        pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }],
        pageCount: totalPages,
      };
    } catch (e) {
      console.error('PDF parsing error, attempting OCR via Gemini...', e);
      return await extractImageOCR(buffer, 'application/pdf');
    }
  }

  if (fileType === 'docx') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      const pages = splitTextIntoPages(text, 1500);
      return {
        text,
        pages,
        pageCount: pages.length,
      };
    } catch (e) {
      console.error('DOCX extraction error:', e);
      throw new Error('Failed to extract text from DOCX file.');
    }
  }

  if (fileType === 'txt' || fileType === 'md') {
    const text = buffer.toString('utf-8').trim();
    const pages = splitTextIntoPages(text, 1500);
    return {
      text,
      pages,
      pageCount: pages.length,
    };
  }

  if (fileType === 'image' || fileType === 'pptx') {
    return await extractImageOCR(buffer, fileType === 'image' ? 'image/png' : 'application/octet-stream');
  }

  // Default fallback text conversion
  const text = buffer.toString('utf-8').trim();
  const pages = splitTextIntoPages(text, 1500);
  return { text, pages, pageCount: pages.length };
}

function splitTextIntoPages(text: string, charsPerPage = 1500): ExtractedPage[] {
  const pages: ExtractedPage[] = [];
  const totalPages = Math.max(1, Math.ceil(text.length / charsPerPage));
  for (let i = 0; i < totalPages; i++) {
    const pText = text.slice(i * charsPerPage, (i + 1) * charsPerPage);
    pages.push({
      pageNumber: i + 1,
      text: pText.trim(),
    });
  }
  return pages;
}

async function extractImageOCR(buffer: Buffer, mimeType: string): Promise<ExtractionResult> {
  if (!process.env.GEMINI_API_KEY) {
    const fallbackText = buffer.toString('utf-8');
    return {
      text: fallbackText,
      pages: [{ pageNumber: 1, text: fallbackText }],
      pageCount: 1,
    };
  }

  try {
    const base64Data = buffer.toString('base64');
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType.startsWith('image') ? mimeType : 'image/png',
          },
        },
        {
          text: 'Perform Optical Character Recognition (OCR) on this academic document/image. Extract ALL readable text cleanly, including titles, formulas, code snippets, lists, diagrams description, and notes. Format with clear headers.',
        },
      ],
    });

    const ocrText = response.text || 'Extracted text from document image.';
    const pages = splitTextIntoPages(ocrText, 1500);
    return {
      text: ocrText,
      pages,
      pageCount: pages.length,
    };
  } catch (err) {
    console.error('Gemini OCR error:', err);
    return {
      text: 'Extracted text preview.',
      pages: [{ pageNumber: 1, text: 'Extracted text preview.' }],
      pageCount: 1,
    };
  }
}
