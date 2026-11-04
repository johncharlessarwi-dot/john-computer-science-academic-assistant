import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStudyQuery } from '../src/utils/queryNormalization.ts';

test('queryNormalization behavior', () => { assert.equal(normalizeStudyQuery('  data   structures \n '), 'data structures'); });
