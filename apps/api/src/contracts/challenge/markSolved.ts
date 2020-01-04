import { createContract } from '../../lib';
import { S } from 'schema';
import { createStatsUpdate } from './createStatsUpdate';
import { transactWriteItems, createKey } from '../../common/db';
import { DbChallengeSolved } from '../../types';

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
    const solvedKey = createKey({
      type: 'CHALLENGE_SOLVED',
      userId: values.userId,
      challengeId: values.challengeId,
    });
    const dbSolved: DbChallengeSolved = {
      ...solvedKey,
      challengeId: values.challengeId,
      data_n: values.solvedAt,
      userId: values.userId,
    };

    await transactWriteItems({
      conditionalPutItems: [
        {
          expression: 'attribute_not_exists(pk)',
          item: dbSolved,
        },
      ],
      updateItems: [createStatsUpdate(values.challengeId, 'solved', 1)],
    }).catch(e => {
      // ignore if already solved
      if (e.code === 'TransactionCanceledException') {
        return;
      }
      throw e;
    });
  });
