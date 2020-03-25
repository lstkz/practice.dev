import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';
import * as userReader from '../../readers/userReader';

const INVALID_CRED = 'Invalid credentials or user not found';

export const login = createContract('user.login')
  .params('values')
  .schema({
    values: S.object().keys({
      emailOrUsername: S.string().trim(),
      password: S.string(),
    }),
  })

  .fn(async values => {
    const { emailOrUsername } = values;
    const userId = await userReader.getUserIdByEmailOrUsernameOrNull(
      emailOrUsername
    );
    if (!userId) {
      throw new AppError(INVALID_CRED);
    }
    const user = await userReader.getById(userId);
    const hash = await createPasswordHash(values.password, user.salt);
    if (user.password !== hash) {
      throw new AppError(INVALID_CRED);
    }
    return _generateAuthData(user);
  });

export const loginRpc = createRpcBinding({
  public: true,
  signature: 'user.login',
  handler: login,
});
