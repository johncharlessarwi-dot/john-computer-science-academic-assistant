import { DocumentChunk } from '../types.js';
import { ExtractedPage } from './docProcessor.js';

export function chunkDocumentPages(
  pages: ExtractedPage[],
  documentId: string,
  userId: string,
  courseId: string,
  fileName: string,
  targetChunkSize = 600,
  overlap = 100
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let globalChunkIndex = 0;

  for (const page of pages) {
    const pText = page.text;
    if (!pText || pText.length === 0) continue;

    // Detect section titles if available (e.g. lines starting with # or uppercase)
    const lines = pText.split('\n');
    let currentSection = `Page ${page.pageNumber}`;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 3 && trimmed.length < 80 && (trimmed.startsWith('#') || trimmed === trimmed.toUpperCase())) {
        currentSection = trimmed.replace(/^#+\s*/, '');
        break;
      }
    }

    let start = 0;
    while (start < pText.length) {
      let end = start + targetChunkSize;
      if (end < pText.length) {
        // Try to break at a period, newline, or space
        const lastPeriod = pText.lastIndexOf('.', end);
        const lastNewline = pText.lastIndexOf('\n', end);
        const breakPoint = Math.max(lastPeriod, lastNewline);
        if (breakPoint > start + targetChunkSize / 2) {
          end = breakPoint + 1;
        }
      } else {
        end = pText.length;
      }

      const chunkContent = pText.slice(start, end).trim();
      if (chunkContent.length > 20) {
        chunks.push({
          id: `chunk_${documentId}_${globalChunkIndex}`,
          documentId,
          userId,
          courseId,
          fileName,
          pageNumber: page.pageNumber,
          sectionTitle: currentSection,
          chunkIndex: globalChunkIndex,
          content: chunkContent,
        });
        globalChunkIndex++;
      }

      start = end - overlap;
      if (start < 0 || start >= pText.length || end === pText.length) {
        break;
      }
    }
  }

  return chunks;
}
