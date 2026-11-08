import test from 'node:test';
import assert from 'node:assert/strict';
import { LoginLimiter } from '../src/server/loginLimiter.ts';

test('login failures are throttled at the configured threshold',()=>{
  const limiter=new LoginLimiter(3,1000,()=>0);
  for(let i=0;i<3;i++)limiter.failure('ip:user');
  assert.equal(limiter.blocked('ip:user'),true);
  assert.equal(limiter.blocked('other:user'),false);
});
