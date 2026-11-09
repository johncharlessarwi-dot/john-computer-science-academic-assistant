import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeExactAnswers } from '../src/utils/quizGrading.ts';

test('grades nonempty answers case-insensitively', () => {
  assert.deepEqual(gradeExactAnswers(['A', 'b'], ['a', 'C']), { correct: 1, total: 2, percent: 50 });
});

test('does not credit unanswered questions or blank answer keys', () => {
  assert.deepEqual(gradeExactAnswers(['', 'B', ' '], ['', 'b', ' ']), { correct: 1, total: 3, percent: 33 });
  assert.deepEqual(gradeExactAnswers([], ['A', '']), { correct: 0, total: 2, percent: 0 });
});

test('keeps empty quiz scoring finite', () => {
  assert.deepEqual(gradeExactAnswers([], []), { correct: 0, total: 0, percent: 0 });
});
test('reject nonarray answers', () => { assert.throws(() => gradeExactAnswers(null as unknown as string[], ['A']), TypeError); });
test('reject nonarray answer key', () => { assert.throws(() => gradeExactAnswers([], null as unknown as string[]), TypeError); });

test('rejects nontext answers',()=>{assert.throws(()=>gradeExactAnswers([42] as unknown as string[],['42']),TypeError);});
