export function limitContextCharacters(chunks: string[], maxCharacters = 12000): string {
  if (!Number.isSafeInteger(maxCharacters) || maxCharacters < 0) throw new RangeError('Invalid context limit');
  if (!Array.isArray(chunks) || !chunks.every(x=>typeof x==='string')) throw new TypeError('Context chunks must be text');
  let result = ''; for (const chunk of chunks) { if (result.length >= maxCharacters) break; const piece = result ? '\n\n' + chunk : chunk; result += piece.slice(0, maxCharacters - result.length); } return result;
}
