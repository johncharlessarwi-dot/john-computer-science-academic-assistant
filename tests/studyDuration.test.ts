import test from 'node:test';
import assert from 'node:assert/strict';
import { formatStudyDuration } from '../src/utils/studyDuration.ts';

test('studyDuration behavior', () => { assert.equal(formatStudyDuration(3661),'1h 1m'); });
