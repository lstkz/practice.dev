import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { ProjectEntity, ProjectChallengeSolvedEntity } from '../../entities';
import { AppError } from '../../common/errors';

export const getProjectById = createContract('project.getProjectById')
  .params('userId', 'id')
  .schema({
    userId: S.string().optional(),
    id: S.number(),
  })
  .fn(async (userId, id) => {
    const [project, solved] = await Promise.all([
      ProjectEntity.getByKeyOrNull({ projectId: id }),
      ProjectChallengeSolvedEntity.getProjectSolvedByUserId(id, userId),
    ]);
    if (!project) {
      throw new AppError('Project not found');
    }
    const max = solved.reduce(
      (ret, item) => Math.max(ret, item.challengeId),
      0
    );
    return project.toProject((max / project.challengeCount) * 100);
  });

export const getProjectByIdRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'project.getProjectById',
  handler: getProjectById,
});
