import test from 'node:test';
import assert from 'node:assert/strict';
import { retrievalConfidence } from '../src/utils/retrievalConfidence.ts';

test('retrievalConfidence behavior', () => { assert.equal(retrievalConfidence([0.1,0.91]),'high'); });
