import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStudyQuery } from '../src/utils/queryNormalization.ts';

test('queryNormalization behavior', () => { assert.equal(normalizeStudyQuery('  data   structures \n '), 'data structures'); });
test('remove NUL controls', () => { assert.equal(normalizeStudyQuery('abc\0def'), 'abcdef'); });
test('collapse whitespace', () => { assert.equal(normalizeStudyQuery('  data\t structures\n'), 'data structures'); });
test('normalize fullwidth characters', () => { assert.equal(normalizeStudyQuery('ＡＢＣ'), 'ABC'); });
test('cap query to 2000 characters', () => { assert.equal(normalizeStudyQuery('a'.repeat(5000)).length, 2000); });

test('invalid query type yields no query',()=>{assert.equal(normalizeStudyQuery({} as unknown as string),'');});
