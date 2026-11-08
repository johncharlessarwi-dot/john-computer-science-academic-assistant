import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { hashPassword, verifyPassword, validPassword } from './passwordSecurity.js';

export class CredentialRegistry {
  constructor(private readonly filePath: string) {}

  private read(): Record<string, string> {
    if (!fs.existsSync(this.filePath)) return {};
    const data: unknown = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid credential registry');
    const values = data as Record<string, unknown>;
    if (!Object.values(values).every(v => typeof v === 'string')) throw new Error('Invalid credential record');
    return values as Record<string, string>;
  }

  private write(data: Record<string, string>): void {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true, mode: 0o700 });
    const tmp = this.filePath + '.' + randomBytes(8).toString('hex') + '.tmp';
    try {
      fs.writeFileSync(tmp, JSON.stringify(data), { mode: 0o600, flag: 'wx' });
      fs.renameSync(tmp, this.filePath);
      fs.chmodSync(this.filePath, 0o600);
    } finally {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    }
  }

  async register(email: string, password: unknown): Promise<boolean> {
    const normalized = normalizeEmail(email);
    if (!normalized || !validPassword(password)) return false;
    const records = this.read();
    if (Object.hasOwn(records, normalized)) return false;
    const hashed = await hashPassword(password);
    const latest = this.read();
    if (Object.hasOwn(latest, normalized)) return false;
    latest[normalized] = hashed;
    this.write(latest);
    return true;
  }

  async authenticate(email: string, password: unknown): Promise<boolean> {
    const normalized = normalizeEmail(email);
    if (!normalized) return false;
    const hash = this.read()[normalized];
    return hash ? verifyPassword(password, hash) : false;
  }
}

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== 'string' || email.length > 254) return null;
  const normalized = email.trim().toLowerCase();
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/.test(normalized) ? normalized : null;
}
