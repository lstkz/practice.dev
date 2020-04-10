import { S } from 'schema';
import { createContract, createRpcBinding, ses } from '../../lib';
import { _createUser } from './_createUser';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { randomUniqString, getDuration } from '../../common/helper';
import { BASE_URL, EMAIL_SENDER } from '../../config';
import { ResetPasswordCodeEntity, UserEntity } from '../../entities';

export const resetPassword = createContract('user.resetPassword')
  .params('emailOrUsername')
  .schema({
    emailOrUsername: S.string().trim(),
  })
  .fn(async emailOrUsername => {
    const user = await UserEntity.getUserByEmailOrUsernameOrNull(
      emailOrUsername
    );
    if (!user) {
      throw new AppError('User not found');
    }
    const code = randomUniqString();
    const resetPasswordCode = new ResetPasswordCodeEntity({
      code,
      userId: user.userId,
      expireAt: Date.now() + getDuration(1, 'd'),
    });

    await resetPasswordCode.insert();
    const url = `${BASE_URL}/reset-password/${code}`;

    await ses
      .sendEmail({
        Source: EMAIL_SENDER,
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Subject: {
            Data: 'Reset your password',
          },
          Body: {
            Html: {
              Data: `
Hi ${user.username},
<br/>
<br/>
Please open the following url to reset your password:
<br/>
<a href="${url}">Reset Password</a> 

<br/>
<br/>
Alternatively, open the following url in your browser:
<br/>
<a href="${url}">${url}</a> 

<br/>
<br/>
Practice.dev
                `.trim(),
            },
          },
        },
      })
      .promise();
  });

export const resetPasswordRpc = createRpcBinding({
  public: true,
  signature: 'user.resetPassword',
  handler: resetPassword,
});
