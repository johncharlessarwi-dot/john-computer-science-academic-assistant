import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeExactAnswers } from '../src/utils/quizGrading.ts';

test('quizGrading behavior', () => { assert.deepEqual(gradeExactAnswers(['A','b'],['a','C']),{correct:1,total:2,percent:50}); });
