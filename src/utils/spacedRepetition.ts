export function nextReviewDays(outcome: 'again' | 'hard' | 'good' | 'easy', repetitions: number): number {
  const n = Math.max(0,Math.min(30,Math.trunc(repetitions)));
  if (outcome === 'again') return 1;
  const base = outcome === 'hard' ? 2 : outcome === 'good' ? 3 : 5;
  return Math.min(365,Math.round(base * Math.pow(1.6,n)));
}
