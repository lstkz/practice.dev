import {
  SolutionEntity,
  UserEntity,
  SolutionVoteEntity,
} from '../../entities2';

export async function _populateSolution(
  solution: SolutionEntity,
  userId: string | undefined
) {
  const [vote, user] = await Promise.all([
    userId
      ? SolutionVoteEntity.getByKeyOrNull({
          solutionId: solution.solutionId,
          userId,
        })
      : undefined,
    UserEntity.getByKey({ userId: solution.userId }),
  ]);
  return solution.toSolution(user!, vote);
}
