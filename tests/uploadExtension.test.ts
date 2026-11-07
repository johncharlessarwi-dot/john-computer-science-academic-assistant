import test from 'node:test';
import assert from 'node:assert/strict';
import { supportedStudyDocument } from '../src/utils/uploadExtension.ts';

test('uploadExtension behavior', () => { assert.equal(supportedStudyDocument('notes.exe'),false); assert.equal(supportedStudyDocument('notes.PDF'),true); });
test('reject filename containing newline', () => { assert.equal(supportedStudyDocument('notes\n.pdf'), false); });
test('reject filename containing NUL', () => { assert.equal(supportedStudyDocument('notes\0.pdf'), false); });
