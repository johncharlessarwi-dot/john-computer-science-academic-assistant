import test from 'node:test';
import assert from 'node:assert/strict';
import { completionPercentage } from '../src/utils/academicProgress.ts';

test('academicProgress behavior', () => { assert.equal(completionPercentage(3,4),75); assert.equal(completionPercentage(5,4),100); });
