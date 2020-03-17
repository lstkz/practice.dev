import { DbSolution, DbSolutionVote } from '../../types';
import { createKey, getItem } from '../../common/db';
// import { getDbUserById } from '../user/getDbUserById';
import { mapDbSolution } from '../../common/mapping';

export async function _populateSolution(
  dbSolution: DbSolution,
  userId: string | undefined
) {
  const voteKey = userId
    ? createKey({
        type: 'SOLUTION_VOTE',
        solutionId: dbSolution.solutionId,
        userId,
      })
    : undefined;

  const [vote, user] = await Promise.all([
    voteKey ? getItem<DbSolutionVote>(voteKey) : undefined,
    getDbUserById(dbSolution.userId),
  ]);

  return mapDbSolution(dbSolution, user!, vote);
}
