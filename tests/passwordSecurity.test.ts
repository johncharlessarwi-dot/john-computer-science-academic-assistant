import test from 'node:test';
import assert from 'node:assert/strict';
import { validPassword, hashPassword, verifyPassword } from '../src/server/passwordSecurity.ts';

test('passwords must meet bounded length and type constraints',()=>{
  assert.equal(validPassword('short'),false);
  assert.equal(validPassword('a'.repeat(12)),true);
  assert.equal(validPassword('a'.repeat(257)),false);
  assert.equal(validPassword(null),false);
});

test('salted credential verification succeeds only for correct password',async()=>{
  const stored = await hashPassword('correct-password-2026');
  assert.equal(await verifyPassword('correct-password-2026',stored),true);
  assert.equal(await verifyPassword('incorrect-password',stored),false);
});
