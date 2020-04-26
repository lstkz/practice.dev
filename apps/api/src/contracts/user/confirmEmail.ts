import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { AppError } from '../../common/errors';
import { _generateAuthData } from './_generateAuthData';
import { ConfirmCodeCollection } from '../../collections/ConfirmCode';
import { UserCollection } from '../../collections/UserModel';

export const confirmEmail = createContract('user.confirmEmail')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const confirmCode = await ConfirmCodeCollection.findOne({ _id: code });
    if (!confirmCode) {
      throw new AppError('Invalid code');
    }
    const user = await UserCollection.findOneOrThrow({
      _id: confirmCode.userId,
    });
    await UserCollection.findOneAndUpdate(
      {
        _id: confirmCode.userId,
      },
      {
        $set: R.pick(user, ['isVerified']),
      }
    );
    return _generateAuthData(user);
  });

export const confirmEmailRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmEmail',
  handler: confirmEmail,
});
