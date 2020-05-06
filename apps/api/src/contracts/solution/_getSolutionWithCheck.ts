import { AppError } from '../../common/errors';
import { assertAuthorOrAdmin } from '../../common/helper';
import { UserEntity, SolutionEntity } from '../../entities';

export async function _getSolutionWithPermissionCheck(
  userId: string,
  solutionId: string
) {
  const [user, solution] = await Promise.all([
    UserEntity.getByKey({
      userId,
    }),
    SolutionEntity.getByKeyOrNull({ solutionId }),
  ]);
  if (!solution) {
    throw new AppError('Solution not found');
  }
  assertAuthorOrAdmin(solution, user!);

  return solution;
}
