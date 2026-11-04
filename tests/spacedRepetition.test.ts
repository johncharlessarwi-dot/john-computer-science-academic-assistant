import test from 'node:test';
import assert from 'node:assert/strict';
import { nextReviewDays } from '../src/utils/spacedRepetition.ts';

test('spacedRepetition behavior', () => { assert.equal(nextReviewDays('again',5),1); });
