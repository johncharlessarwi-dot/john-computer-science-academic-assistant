export function limitContextCharacters(chunks: string[], maxCharacters = 12000): string {
  if (!Number.isSafeInteger(maxCharacters) || maxCharacters < 0) throw new RangeError('Invalid context limit');
  return chunks.join('\n\n').slice(0, maxCharacters);
}
