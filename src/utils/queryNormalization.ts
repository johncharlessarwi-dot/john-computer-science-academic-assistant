export function normalizeStudyQuery(input: string): string {
  return input.normalize('NFKC').replace(/\s+/g, ' ').trim().slice(0, 2000);
}
