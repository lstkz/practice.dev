import {
  ProjectChallengeEntity,
  ChallengeEntity,
  ProjectEntity,
} from '../entities';
import { AppError } from './errors';
import { checkProjectChallengePermission } from '../contracts/project/checkProjectChallengePermission';
import { BASE_URL } from '../config';

export async function validateChallengeOrProjectChallenge(
  userId: string | undefined,
  { projectId, challengeId }: { projectId?: number; challengeId?: number }
) {
  if (projectId) {
    if (!challengeId) {
      throw new AppError('challengeId is required if projectId is defined');
    }
    const [project, challenge] = await Promise.all([
      ProjectEntity.getByKeyOrNull({ projectId }),
      ProjectChallengeEntity.getByKeyOrNull({
        challengeId: challengeId,
        projectId: projectId,
      }),
    ]);
    if (!project) {
      throw new AppError('Project not found');
    }
    if (!challenge) {
      throw new AppError('Project Challenge not found');
    }
    const hasAccess = await checkProjectChallengePermission(userId, {
      projectId,
      challengeId,
    });
    if (!hasAccess) {
      throw new AppError(
        "You don't have permission to access the provided Project Challenge."
      );
    }
    return challenge;
  } else {
    if (!challengeId) {
      return;
    }
    const challenge = await ChallengeEntity.getByKeyOrNull({
      challengeId: challengeId,
    });
    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    return challenge;
  }
}

export async function getChallengeOrProjectChallenge(
  userId: string | undefined,
  { projectId, challengeId }: { projectId?: number; challengeId: number }
) {
  const ret = await validateChallengeOrProjectChallenge(userId, {
    projectId,
    challengeId,
  });
  if (!ret) {
    throw new Error('Expected challenge or project challenge');
  }
  return ret;
}

export function getChallengeUrl(
  challenge: ProjectChallengeEntity | ChallengeEntity
) {
  return 'projectId' in challenge
    ? `${BASE_URL}/projects/${challenge.projectId}/challenges/${challenge.challengeId}`
    : `${BASE_URL}/challenges/${challenge.challengeId}`;
}
