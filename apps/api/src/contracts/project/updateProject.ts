import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { ProjectEntity, ProjectChallengeEntity } from '../../entities';
import {
  safeAssign,
  safeKeys,
  differenceBy,
  intersectionBy,
} from '../../common/helper';

export const updateProject = createContract('project.updateProject')
  .params('values', 'challenges')
  .schema({
    values: S.object().keys({
      id: S.number(),
      title: S.string(),
      description: S.string(),
      domain: S.enum().literal('frontend', 'backend', 'fullstack', 'styling'),
    }),
    challenges: S.array().items(
      S.object().keys({
        id: S.number(),
        title: S.string(),
        description: S.string(),
        domain: S.enum().literal('frontend', 'backend', 'fullstack', 'styling'),
        detailsBundleS3Key: S.string(),
        testsBundleS3Key: S.string(),
        testCase: S.string(),
        assets: S.object().unknown().optional().nullable(),
      })
    ),
  })
  .fn(async (values, challenges) => {
    const project = await ProjectEntity.getByKeyOrNull({
      projectId: values.id,
    });
    challenges.forEach(item => {
      if (!item.assets) {
        item.assets = null;
      }
    });
    const exactValues = R.omit(values, ['id']);
    const t = createTransaction();
    if (project) {
      safeAssign(project, exactValues);
      project.challengeCount = challenges.length;
      t.update(project, [...safeKeys(exactValues), 'challengeCount']);
    } else {
      const newProject = new ProjectEntity({
        ...exactValues,
        projectId: values.id,
        createdAt: Date.now(),
        challengeCount: challenges.length,
        stats: {},
      });
      t.insert(newProject);
    }
    const existingChallenges = await ProjectChallengeEntity.getByProject(
      values.id
    );
    const getId = (x: { id: number } | { challengeId: number }) =>
      'id' in x ? x.id : x.challengeId;
    const newChallenges = differenceBy(challenges, existingChallenges, getId);
    const updatedChallenges = intersectionBy(
      challenges,
      existingChallenges,
      getId
    );
    const removedChallenges = differenceBy(
      existingChallenges,
      challenges,
      getId
    );
    newChallenges.forEach(item => {
      t.insert(
        new ProjectChallengeEntity({
          ...R.omit(item, ['id']),
          projectId: values.id,
          challengeId: item.id,
          createdAt: Date.now(),
        })
      );
    });
    removedChallenges.forEach(item => {
      t.delete(item);
    });
    updatedChallenges.forEach(item => {
      const existing = existingChallenges.find(x => x.challengeId === item.id)!;
      const exactValues = R.omit(item, ['id']);
      safeAssign(existing, exactValues);
      t.update(existing, safeKeys(exactValues));
    });
    await t.commit();
  });

export const updateProjectRpc = createRpcBinding({
  admin: true,
  signature: 'project.updateProject',
  handler: updateProject,
});
