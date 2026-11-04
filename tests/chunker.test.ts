import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkDocumentPages } from '../src/server/chunker.ts';

const page = [{ pageNumber: 1, text: 'Long academic section '.repeat(60) }];

test('rejects a zero chunk size instead of looping', () => {
  assert.throws(() => chunkDocumentPages(page, 'd1', 'u1', 'c1', 'notes.txt', 0, 0), RangeError);
});

test('rejects overlap equal to chunk size', () => {
  assert.throws(() => chunkDocumentPages(page, 'd1', 'u1', 'c1', 'notes.txt', 64, 64), RangeError);
});

test('accepts normal chunk configuration', () => {
  const chunks = chunkDocumentPages(page, 'd1', 'u1', 'c1', 'notes.txt', 120, 20);
  assert.ok(chunks.length > 1);
  assert.equal(chunks[0].pageNumber, 1);
});
