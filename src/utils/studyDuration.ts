export function formatStudyDuration(seconds: number): string {
  const n = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(n / 3600)}h ${Math.floor(n % 3600 / 60)}m`;
}
