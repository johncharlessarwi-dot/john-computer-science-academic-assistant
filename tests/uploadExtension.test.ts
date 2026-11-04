import test from 'node:test';
import assert from 'node:assert/strict';
import { supportedStudyDocument } from '../src/utils/uploadExtension.ts';

test('uploadExtension behavior', () => { assert.equal(supportedStudyDocument('notes.exe'),false); assert.equal(supportedStudyDocument('notes.PDF'),true); });
