import test from 'node:test';
import assert from 'node:assert/strict';
import { safeAcademicFilename } from '../src/utils/filenameSafety.ts';

test('filenameSafety behavior', () => { assert.equal(safeAcademicFilename('../lecture.pdf'),'_lecture.pdf'); });
test('strip trailing dots', () => { assert.equal(safeAcademicFilename('lecture.pdf...'), 'lecture.pdf'); });
test('strip trailing whitespace', () => { assert.equal(safeAcademicFilename('notes.pdf '), 'notes.pdf'); });
