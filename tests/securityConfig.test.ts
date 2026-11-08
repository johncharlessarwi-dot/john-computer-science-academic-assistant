import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const server = () => fs.readFileSync('server.ts', 'utf8');

test('credential storage and uploads are ignored from version control',()=>{
  const rules=fs.readFileSync('.gitignore','utf8');
  assert.match(rules,/^data\\/\\s*$/m);
  assert.match(rules,/^uploads\\/\\s*$/m);
});

test('private API parsers enforce bounded body size',()=>{assert.match(server(),/express\\.json\\(\\{ limit: '1mb'/);assert.match(server(),/express\\.urlencoded\\(\\{ extended: false, limit: '64kb'/);});

test('authenticated routes prevent private response caching',()=>{assert.match(server(),/Cache-Control', 'no-store, private'/);});

test('AI error handler does not interpolate provider secrets',()=>{assert.doesNotMatch(server(),/assistantText = `I encountered an issue generating the AI response: /);});
