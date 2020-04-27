import { createContract } from '../../lib';
import { S } from 'schema';
import { ChallengeSolvedCollection } from '../../collections/ChallengeSolved';

export const markSolved = createContract('challenge.markSolved')
  .params('values')
  .schema({
    values: S.object().keys({
      userId: S.number(),
      challengeId: S.number(),
      solvedAt: S.date(),
    }),
  })
  .fn(async values => {
    await ChallengeSolvedCollection.findOneAndUpdate(
      {
        userId: values.userId,
        challengeId: values.challengeId,
      },
      {
        $setOnInsert: values,
      }
    );
  });
