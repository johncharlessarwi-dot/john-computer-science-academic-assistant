import test from 'node:test';
import assert from 'node:assert/strict';
import { safeAcademicFilename } from '../src/utils/filenameSafety.ts';

test('filenameSafety behavior', () => { assert.equal(safeAcademicFilename('../lecture.pdf'),'_lecture.pdf'); });
test('strip trailing dots', () => { assert.equal(safeAcademicFilename('lecture.pdf...'), 'lecture.pdf'); });
test('strip trailing whitespace', () => { assert.equal(safeAcademicFilename('notes.pdf '), 'notes.pdf'); });
test('replace Windows separators', () => { assert.equal(safeAcademicFilename('folder\\notes.pdf'), 'folder_notes.pdf'); });
test('fallback for empty name', () => { assert.equal(safeAcademicFilename('...'), 'unnamed-document'); });

test('invalid filenames fall back safely',()=>{assert.equal(safeAcademicFilename(null as unknown as string),'unnamed-document');});
