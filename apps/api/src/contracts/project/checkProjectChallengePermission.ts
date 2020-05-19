import { S } from 'schema';
import { createContract } from '../../lib';
import { ProjectChallengeSolvedEntity } from '../../entities';

export const checkProjectChallengePermission = createContract(
  'project.checkProjectChallengePermission'
)
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      projectId: S.number(),
      challengeId: S.number(),
    }),
  })
  .fn(async (userId, values) => {
    if (values.challengeId === 1) {
      return true;
    }
    const result = await ProjectChallengeSolvedEntity.getByKeyOrNull({
      userId,
      projectId: values.projectId,
      challengeId: values.challengeId - 1,
    });
    return result != null;
  });
