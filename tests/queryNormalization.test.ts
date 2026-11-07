import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStudyQuery } from '../src/utils/queryNormalization.ts';

test('queryNormalization behavior', () => { assert.equal(normalizeStudyQuery('  data   structures \n '), 'data structures'); });
test('remove NUL controls', () => { assert.equal(normalizeStudyQuery('abc\0def'), 'abcdef'); });
test('collapse whitespace', () => { assert.equal(normalizeStudyQuery('  data\t structures\n'), 'data structures'); });
test('normalize fullwidth characters', () => { assert.equal(normalizeStudyQuery('ＡＢＣ'), 'ABC'); });
