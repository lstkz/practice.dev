import { createContract } from '../../lib';
import { S } from 'schema';
import { ChallengeSolvedEntity } from '../../entities';
import { transactWriteItems } from '../../common/db-next';

export const markSolved = createContract('challenge.markSolved')
  .params('values')
  .schema({
    values: S.object().keys({
      userId: S.string(),
      challengeId: S.number(),
      solvedAt: S.number(),
    }),
  })
  .fn(async values => {
    const solved = new ChallengeSolvedEntity(values);
    await transactWriteItems([
      {
        Put: {
          ...solved.preparePut(),
          ConditionExpression: 'attribute_not_exists(pk)',
        },
      },
    ]).catch(e => {
      // ignore if already solved
      if (e.code === 'TransactionCanceledException') {
        return;
      }
      throw e;
    });
  });
