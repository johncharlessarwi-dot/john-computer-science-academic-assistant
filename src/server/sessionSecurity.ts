import { createHash, randomBytes } from 'node:crypto';

export class SessionStore {
  private readonly sessions = new Map<string, { userId: string; expiresAt: number }>();
  constructor(private readonly lifetimeMs = 8 * 60 * 60 * 1000, private readonly clock = () => Date.now()) {}

  private key(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  issue(userId: string): string {
    if (typeof userId !== 'string' || !/^[A-Za-z0-9_-]{3,100}$/.test(userId)) throw new TypeError('Invalid session subject');
    if (!Number.isSafeInteger(this.lifetimeMs) || this.lifetimeMs <= 0 || this.lifetimeMs > 86_400_000) throw new RangeError('Invalid session lifetime');
    for (const [key, record] of this.sessions) if (record.expiresAt <= this.clock()) this.sessions.delete(key);
    if (this.sessions.size >= 10_000) throw new Error('Session capacity reached');
    const token = randomBytes(32).toString('base64url');
    this.sessions.set(this.key(token), { userId, expiresAt: this.clock() + this.lifetimeMs });
    return token;
  }

  verify(token: unknown): string | null {
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    const key = this.key(token);
    const record = this.sessions.get(key);
    if (!record) return null;
    if (record.expiresAt <= this.clock()) { this.sessions.delete(key); return null; }
    return record.userId;
  }

  revoke(token: unknown): void {
    if (typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token)) this.sessions.delete(this.key(token));
  }
}
