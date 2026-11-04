export function extractStudyKeywords(input: string, limit = 12): string[] {
  const terms = input.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [];
  return [...new Set(terms)].slice(0, Math.max(0, Math.min(100, limit)));
}
