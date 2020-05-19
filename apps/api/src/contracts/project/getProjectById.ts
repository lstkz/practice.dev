import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import {
  ProjectEntity,
  ProjectChallengeSolvedEntity,
  ProjectChallengeEntity,
} from '../../entities';
import { AppError } from '../../common/errors';

export const getProjectById = createContract('project.getProjectById')
  .params('userId', 'id')
  .schema({
    userId: S.string().optional(),
    id: S.number(),
  })
  .fn(async (userId, id) => {
    const [projectEntity, challengeEntities, solved] = await Promise.all([
      ProjectEntity.getByKeyOrNull({ projectId: id }),
      ProjectChallengeEntity.getByProject(id),
      ProjectChallengeSolvedEntity.getProjectSolvedByUserId(id, userId),
    ]);
    if (!projectEntity) {
      throw new AppError('Project not found');
    }
    const solvedMap = R.indexBy(solved, x => x.challengeId);
    const max = solved.reduce(
      (ret, item) => Math.max(ret, item.challengeId),
      0
    );

    const challenges = challengeEntities.map(item => {
      return item.toChallenge(projectEntity, {
        isSolved: !!solvedMap[item.challengeId],
        isLocked: item.challengeId !== 1 && !solvedMap[item.challengeId - 1],
      });
    });
    const project = projectEntity.toProject(
      (max / projectEntity.challengeCount) * 100
    );
    return {
      project,
      challenges,
    };
  });

export const getProjectByIdRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'project.getProjectById',
  handler: getProjectById,
});
