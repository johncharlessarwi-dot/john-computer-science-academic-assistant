import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const server = () => fs.readFileSync('server.ts', 'utf8');

test('credential storage and uploads are ignored from version control',()=>{
  const rules=fs.readFileSync('.gitignore','utf8').split(/\r?\n/);
  assert.ok(rules.includes('data/'));
  assert.ok(rules.includes('uploads/'));
});

test('private API parsers enforce bounded body size',()=>{
  assert.ok(server().includes("express.json({ limit: '1mb'"));
  assert.ok(server().includes("express.urlencoded({ extended: false, limit: '64kb'"));
});

test('authenticated routes prevent private response caching',()=>{
  assert.ok(server().includes("Cache-Control', 'no-store, private'"));
});

test('AI error handler does not interpolate provider secrets',()=>{
  assert.ok(!server().includes('assistantText = `I encountered an issue generating the AI response:'));
});

test('login endpoint uses a server-side attempt limiter',()=>{assert.ok(server().includes('loginLimiter.blocked(attemptKey)'));assert.ok(server().includes('loginLimiter.failure(attemptKey)'));});

test('registration endpoints have a server-side rate limit',()=>{assert.ok(server().includes('loginLimiter.blocked(registrationKey)'));assert.ok(server().includes('loginLimiter.failure(registrationKey)'));});
