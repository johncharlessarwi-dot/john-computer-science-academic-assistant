export function completionPercentage(completed: number, total: number): number {
  if (!Number.isSafeInteger(completed)||!Number.isSafeInteger(total)) return 0;
  if (!Number.isFinite(completed) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.max(0,Math.min(100,Math.round(completed / total * 100)));
}
