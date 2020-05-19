import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import {
  ProjectEntity,
  ProjectChallengeEntity,
  ProjectChallengeSolvedEntity,
} from '../../entities';
import { checkProjectChallengePermission } from './checkProjectChallengePermission';
import { AppError } from '../../common/errors';

export const getProjectChallenge = createContract('project.getProjectChallenge')
  .params('userId', 'values')
  .schema({
    userId: S.string().optional(),
    values: S.object().keys({
      projectId: S.number(),
      challengeId: S.number(),
    }),
  })
  .fn(async (userId, values) => {
    const [
      projectEntity,
      challengeEntity,
      isSolved,
      canAccess,
    ] = await Promise.all([
      ProjectEntity.getByKeyOrNull({ projectId: values.projectId }),
      ProjectChallengeEntity.getByKeyOrNull(values),
      ProjectChallengeSolvedEntity.getIsSolved(userId, values),
      checkProjectChallengePermission(userId, values),
    ]);
    if (!projectEntity) {
      throw new AppError('Project not found');
    }
    if (!challengeEntity) {
      throw new AppError('Challenge not found');
    }
    if (!canAccess) {
      throw new AppError(
        'You must solve previous challenges to access this challenge'
      );
    }
    return challengeEntity.toChallenge(projectEntity, {
      isSolved,
      isLocked: false,
    });
  });

export const getProjectChallengeRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'project.getProjectChallenge',
  handler: getProjectChallenge,
});
