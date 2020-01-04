import { resetDb } from '../helper';
import { rateLimit } from '../../src/contracts/misc/rateLimit';

beforeEach(async () => {
  await resetDb();
});

const key = 'k2';
const expiration = 100000;
const count = 2;

it('does not exist, throw error when creating parallel records', async () => {
  await expect(
    Promise.all([
      rateLimit(key, expiration, count),
      rateLimit(key, expiration, count),
    ])
  ).rejects.toThrow('Rate limiter error. Parallel requests are not supported');
});

it('exists, throw error when creating parallel records', async () => {
  await rateLimit(key, expiration, count);

  await expect(
    Promise.all([
      rateLimit(key, expiration, count),
      rateLimit(key, expiration, count),
    ])
  ).rejects.toThrow('Rate limiter error. Parallel requests are not supported');
});

it('create 2 requests, but reject 3rd', async () => {
  await rateLimit(key, expiration, count);
  await rateLimit(key, expiration, count);
  await expect(rateLimit(key, expiration, count)).rejects.toThrow(
    'Rate limit exceeded. Limit is 2 requests per 100000ms.'
  );
});

it('create 3rd record successfully if expired', async () => {
  await rateLimit(key, expiration, count);
  await rateLimit(key, expiration, count);
  const now = Date.now();
  Date.now = () => now + expiration + 1;
  await rateLimit(key, expiration, count);
});
