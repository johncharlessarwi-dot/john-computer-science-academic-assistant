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

test('registered credentials persist without storing plaintext',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'jcsaa-auth-'));
  try {
    const target=path.join(dir,'auth.json');
    const registry=new CredentialRegistry(target);
    assert.equal(await registry.register('alice@example.com','safe-password-2026'),true);
    assert.equal(await registry.register('alice@example.com','safe-password-2026'),false);
    assert.equal(await new CredentialRegistry(target).authenticate('alice@example.com','safe-password-2026'),true);
    assert.equal(await registry.authenticate('alice@example.com','wrong-password'),false);
    assert.equal(fs.readFileSync(target,'utf8').includes('safe-password-2026'),false);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
