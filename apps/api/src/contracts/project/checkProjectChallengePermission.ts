import { S } from 'schema';
import { createContract } from '../../lib';
import { ProjectChallengeSolvedEntity } from '../../entities';
import { AppError } from '../../common/errors';

export const checkProjectChallengePermission = createContract(
  'project.checkProjectChallengePermission'
)
  .params('userId', 'values')
  .schema({
    userId: S.string().optional(),
    values: S.object().keys({
      projectId: S.number(),
      challengeId: S.number(),
    }),
  })
  .fn(async (userId, values) => {
    if (values.challengeId === 1) {
      return true;
    }
    if (!userId) {
      return false;
    }
    const result = await ProjectChallengeSolvedEntity.getByKeyOrNull({
      userId,
      projectId: values.projectId,
      challengeId: values.challengeId - 1,
    });
    return result != null;
  });

export async function assertProjectChallengePermission(
  userId: string | undefined,
  values: {
    projectId: number;
    challengeId: number;
  }
) {
  const hasAccess = await checkProjectChallengePermission(userId, values);
  if (!hasAccess) {
    throw new AppError(
      "You don't have permission to access the provided project challenge."
    );
  }
}
