export function normalizeStudyQuery(input: string): string {
  return input.normalize('NFKC').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 2000);
}
