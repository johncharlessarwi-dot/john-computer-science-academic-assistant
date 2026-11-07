import test from 'node:test';
import assert from 'node:assert/strict';
import { redactStudentEmail } from '../src/utils/studentPrivacy.ts';

test('studentPrivacy behavior', () => { assert.equal(redactStudentEmail('john@example.com'),'[email redacted]'); });
test('redact multiple addresses', () => { assert.equal(redactStudentEmail('a@school.edu and b@uni.ac.tz'), '[email redacted] and [email redacted]'); });
test('retain ordinary lecture text', () => { assert.equal(redactStudentEmail('Lecture on recursion'), 'Lecture on recursion'); });
