export function retrievalConfidence(scores: number[]): 'none' | 'low' | 'medium' | 'high' {
  const best = Math.max(0, ...scores.filter(Number.isFinite));
  if (best >= 0.8) return 'high';
  if (best >= 0.5) return 'medium';
  if (best > 0) return 'low';
  return 'none';
}
