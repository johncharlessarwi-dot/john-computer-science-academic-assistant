import test from 'node:test';
import assert from 'node:assert/strict';
import { extractStudyKeywords } from '../src/utils/studyKeywords.ts';

test('studyKeywords behavior', () => { assert.deepEqual(extractStudyKeywords('Algorithms and algorithms DATA'), ['algorithms','and','data']); });
