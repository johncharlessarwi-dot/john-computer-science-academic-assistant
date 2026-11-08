export class LoginLimiter {
  private attempts = new Map<string, { count: number; until: number }>();
  constructor(private readonly maxFailures = 5, private readonly windowMs = 15 * 60 * 1000, private readonly clock = () => Date.now()) {}
  blocked(key: string): boolean {
    const record = this.attempts.get(key);
    if (!record) return false;
    if (record.until <= this.clock()) { this.attempts.delete(key); return false; }
    return record.count >= this.maxFailures;
  }
  failure(key: string): void {
    if (!key || key.length > 500) return;
    if (this.attempts.size > 10_000) for (const [id, record] of this.attempts) if (record.until <= this.clock()) this.attempts.delete(id);
    if (this.attempts.size > 10_000) return;
    const record = this.attempts.get(key);
    this.attempts.set(key, record && record.until > this.clock() ? { count: record.count + 1, until: record.until } : { count: 1, until: this.clock() + this.windowMs });
  }
  success(key: string): void { this.attempts.delete(key); }
}
