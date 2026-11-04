import test from 'node:test';
import assert from 'node:assert/strict';
import { rotateFlashcards } from '../src/utils/flashcardOrder.ts';

test('flashcardOrder behavior', () => { assert.deepEqual(rotateFlashcards([1,2,3],1),[2,3,1]); });
