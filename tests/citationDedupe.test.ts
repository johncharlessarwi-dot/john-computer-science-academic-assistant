import test from 'node:test';
import assert from 'node:assert/strict';
import { uniquePageCitations } from '../src/utils/citationDedupe.ts';

test('citationDedupe behavior', () => { assert.equal(uniquePageCitations([{documentId:'a',pageNumber:1},{documentId:'a',pageNumber:1}]).length,1); });
