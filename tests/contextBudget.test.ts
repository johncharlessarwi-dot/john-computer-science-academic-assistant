import test from 'node:test';
import assert from 'node:assert/strict';
import { limitContextCharacters } from '../src/utils/contextBudget.ts';

test('contextBudget behavior', () => { assert.equal(limitContextCharacters(['hello','world'],8),'hello\n\nw'); });
test('zero budget is empty', () => { assert.equal(limitContextCharacters(['private'], 0), ''); });
