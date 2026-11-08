import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export function validPassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 12 && password.length <= 256 && !/[\x00-\x1f\x7f]/.test(password);
}

export async function hashPassword(password: unknown): Promise<string> {
  if (!validPassword(password)) throw new TypeError('Password does not meet requirements');
  const salt = randomBytes(32);
  const derived = await scrypt(password, salt, KEY_LENGTH) as Buffer;
  return ['scrypt', salt.toString('hex'), derived.toString('hex')].join('$');
}

export async function verifyPassword(password: unknown, encoded: unknown): Promise<boolean> {
  if (!validPassword(password) || typeof encoded !== 'string') return false;
  const parts = encoded.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt' || !/^[a-f0-9]{64}$/.test(parts[1]) || !/^[a-f0-9]{128}$/.test(parts[2])) return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  const actual = await scrypt(password, salt, KEY_LENGTH) as Buffer;
  return timingSafeEqual(actual, expected);
}
