import * as solutionReader from '../../readers/solutionReader';
import * as userReader from '../../readers/userReader';
import { AppError } from '../../common/errors';
import { assertAuthorOrAdmin } from '../../common/helper';

export async function _getSolutionWithPermissionCheck(
  userId: string,
  solutionId: string
) {
  const [user, solution] = await Promise.all([
    userReader.getById(userId),
    solutionReader.getByIdOrNull(solutionId),
  ]);
  if (!solution) {
    throw new AppError('Solution not found');
  }
  assertAuthorOrAdmin(solution, user!);

  return solution;
}
