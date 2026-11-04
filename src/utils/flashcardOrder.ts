export function rotateFlashcards<T>(cards: T[], offset: number): T[] {
  if (!cards.length) return [];
  const n = ((Math.trunc(offset) % cards.length) + cards.length) % cards.length;
  return [...cards.slice(n), ...cards.slice(0,n)];
}
