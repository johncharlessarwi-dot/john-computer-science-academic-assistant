export function uniquePageCitations<T extends {documentId: string; pageNumber: number}>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter(item => { const key = JSON.stringify([item.documentId, item.pageNumber]); if (seen.has(key)) return false; seen.add(key); return true; });
}
