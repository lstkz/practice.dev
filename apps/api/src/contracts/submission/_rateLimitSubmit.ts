import { rateLimit } from '../misc/rateLimit';
import { getDuration } from '../../common/helper';

const RATE_LIMIT_PER_DAY = 1000;
const RATE_LIMIT_PER_HOUR = 100;

export async function _rateLimitSubmit(userId: string) {
  await Promise.all([
    rateLimit(`SUBMIT_days:${userId}`, getDuration(1, 'd'), RATE_LIMIT_PER_DAY),
    rateLimit(
      `SUBMIT_hours:${userId}`,
      getDuration(1, 'h'),
      RATE_LIMIT_PER_HOUR
    ),
  ]);
}
