import test from 'node:test';
import assert from 'node:assert/strict';
import { redactStudentEmail } from '../src/utils/studentPrivacy.ts';

test('studentPrivacy behavior', () => { assert.equal(redactStudentEmail('john@example.com'),'[email redacted]'); });
