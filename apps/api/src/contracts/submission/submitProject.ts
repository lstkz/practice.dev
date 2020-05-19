import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { urlRegex } from 'shared';
import { ProjectChallengeEntity, ProjectEntity } from '../../entities';
import { AppError } from '../../common/errors';
import { _rateLimitSubmit } from './_rateLimitSubmit';
import { _completeSubmit } from './_completeSubmit';
import { checkProjectChallengePermission } from '../project/checkProjectChallengePermission';

export const submitProject = createContract('submission.submitProject')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      projectId: S.number(),
      challengeId: S.number(),
      testUrl: S.string().regex(urlRegex),
    }),
  })
  .fn(async (userId, values) => {
    const project = await ProjectEntity.getByKeyOrNull({
      projectId: values.projectId,
    });
    if (!project) {
      throw new AppError('Project not found');
    }
    const challenge = await ProjectChallengeEntity.getByKeyOrNull({
      challengeId: values.challengeId,
      projectId: values.projectId,
    });
    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    const canSolve = await checkProjectChallengePermission(userId, {
      challengeId: values.challengeId,
      projectId: values.projectId,
    });
    if (!canSolve) {
      throw new AppError('You cannot submit to this challenge');
    }
    const id = await _completeSubmit(userId, {
      ...values,
      tests: challenge.testsBundleS3Key,
      testType: project.domain === 'backend' ? 'backend' : 'frontend',
      type: 'project',
    });
    return {
      id,
    };
  });

export const submitProjectRpc = createRpcBinding({
  verified: true,
  injectUser: true,
  signature: 'submission.submitProject',
  handler: submitProject,
});
