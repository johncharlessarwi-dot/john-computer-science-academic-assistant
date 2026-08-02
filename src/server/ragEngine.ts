import { GoogleGenAI } from '@google/genai';
import { DocumentChunk, Citation } from '../types.js';
import { db } from './db.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function computeTextSimilarityScore(query: string, text: string): number {
  const queryWords = query.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const textLower = text.toLowerCase();
  if (queryWords.length === 0) return 0;

  let matches = 0;
  let exactPhraseBonus = textLower.includes(query.toLowerCase()) ? 0.4 : 0;

  queryWords.forEach(word => {
    if (textLower.includes(word)) {
      matches++;
    }
  });

  const termRatio = matches / queryWords.length;
  return termRatio + exactPhraseBonus;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.GEMINI_API_KEY) {
    return [];
  }
  try {
    const response: any = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: text.slice(0, 2000),
    });
    return response.embedding?.values || response.embeddings?.[0]?.values || [];
  } catch (e) {
    console.warn('Gemini embedding failed, using text similarity fallback:', e);
    return [];
  }
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number;
}

export async function searchRelevantChunks(
  query: string,
  userId: string,
  courseId?: string,
  documentId?: string,
  topK = 5
): Promise<RetrievalResult[]> {
  const allChunks = db.getChunks(userId, courseId, documentId);
  if (allChunks.length === 0) {
    return [];
  }

  const queryEmbedding = await generateEmbedding(query);

  const scored: RetrievalResult[] = allChunks.map(chunk => {
    let score = 0;
    if (queryEmbedding.length > 0 && chunk.embedding && chunk.embedding.length > 0) {
      score = computeCosineSimilarity(queryEmbedding, chunk.embedding);
    } else {
      score = computeTextSimilarityScore(query, chunk.content);
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export function formatContextPrompt(results: RetrievalResult[]): {
  contextText: string;
  citations: Citation[];
} {
  if (results.length === 0) {
    return { contextText: '', citations: [] };
  }

  const citationsMap = new Map<string, Citation>();
  let contextText = 'ACADEMIC MATERIALS CONTEXT:\n\n';

  results.forEach((res, i) => {
    const ch = res.chunk;
    contextText += `--- SOURCE ${i + 1} ---
Document: ${ch.fileName}
Page: ${ch.pageNumber}
Section: ${ch.sectionTitle || 'General'}
Content:
${ch.content}

`;

    const key = `${ch.documentId}_p${ch.pageNumber}`;
    if (!citationsMap.has(key)) {
      citationsMap.set(key, {
        documentId: ch.documentId,
        documentName: ch.fileName,
        pageNumber: ch.pageNumber,
        sectionTitle: ch.sectionTitle,
        snippet: ch.content.slice(0, 120) + '...',
      });
    }
  });

  return {
    contextText,
    citations: Array.from(citationsMap.values()),
  };
}
