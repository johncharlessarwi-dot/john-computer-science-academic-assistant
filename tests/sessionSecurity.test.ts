import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionStore } from '../src/server/sessionSecurity.ts';

test('sessions are unguessable and map to one account',()=>{
  const sessions = new SessionStore();
  const one = sessions.issue('user_123');
  const two = sessions.issue('user_123');
  assert.notEqual(one,two);
  assert.equal(sessions.verify(one),'user_123');
  assert.equal(sessions.verify('forged'),null);
});

test('expired and revoked sessions cannot authenticate',()=>{
  let now=1000;
  const sessions=new SessionStore(1000,()=>now);
  const token=sessions.issue('user_123');
  now=2000;
  assert.equal(sessions.verify(token),null);
  const newer=sessions.issue('user_123');
  sessions.revoke(newer);
  assert.equal(sessions.verify(newer),null);
});
