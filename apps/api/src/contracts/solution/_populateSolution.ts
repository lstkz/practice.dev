import { SolutionEntity } from '../../entities';
import * as solutionReader from '../../readers/solutionReader';
import * as userReader from '../../readers/userReader';

export async function _populateSolution(
  solution: SolutionEntity,
  userId: string | undefined
) {
  const [vote, user] = await Promise.all([
    userId
      ? solutionReader.getSolutionVoteOrNull(solution.solutionId, userId)
      : undefined,
    userReader.getById(solution.userId),
  ]);
  return solution.toSolution(user!, vote);
}
