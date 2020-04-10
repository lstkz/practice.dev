import { createContract, createTransaction } from '../../lib';
import { S } from 'schema';
import { ChallengeSolvedEntity } from '../../entities2';

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
    const t = createTransaction();
    t.insert(solved, {
      conditionExpression: 'attribute_not_exists(pk)',
    });
    await t.commit().catch(e => {
      // ignore if already solved
      if (e.code === 'TransactionCanceledException') {
        return;
      }
      throw e;
    });
  });
