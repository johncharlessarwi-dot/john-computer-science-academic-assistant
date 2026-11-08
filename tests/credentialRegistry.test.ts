import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CredentialRegistry, normalizeEmail } from '../src/server/credentialRegistry.ts';

test('normalizes bounded email without accepting injection controls',()=>{
  assert.equal(normalizeEmail(' A@EXAMPLE.COM '),'a@example.com');
  assert.equal(normalizeEmail('alice'+String.fromCharCode(10)+'@example.com'),null);
});
