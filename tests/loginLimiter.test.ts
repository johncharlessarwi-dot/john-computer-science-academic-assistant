import test from 'node:test';
import assert from 'node:assert/strict';
import { LoginLimiter } from '../src/server/loginLimiter.ts';

test('login failures are throttled at the configured threshold',()=>{
  const limiter=new LoginLimiter(3,1000,()=>0);
  for(let i=0;i<3;i++)limiter.failure('ip:user');
  assert.equal(limiter.blocked('ip:user'),true);
  assert.equal(limiter.blocked('other:user'),false);
});

test('expired attempts and success reset throttling',()=>{
  let now=0;
  const limiter=new LoginLimiter(2,1000,()=>now);
  limiter.failure('x');limiter.failure('x');assert.equal(limiter.blocked('x'),true);
  now=1000;assert.equal(limiter.blocked('x'),false);
  limiter.failure('x');limiter.success('x');assert.equal(limiter.blocked('x'),false);
});
