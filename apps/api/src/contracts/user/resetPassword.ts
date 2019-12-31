import { S } from 'schema';
import {
  createContract,
  createRpcBinding,
  ses,
  EMAIL_SENDER,
  BASE_URL,
} from '../../lib';
import { _createUser } from './_createUser';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { _getDbUserByEmailOrUsername } from './_getDbUserByEmailOrUsername';
import { randomUniqString, getDuration } from '../../common/helper';
import { createKey, putItems } from '../../common/db';
import { DbResetPasswordCode } from '../../types';
import { getDbUserById } from './getDbUserById';

export const resetPassword = createContract('user.resetPassword')
  .params('emailOrUsername')
  .schema({
    emailOrUsername: S.string().trim(),
  })
  .fn(async emailOrUsername => {
    const dbUserEmailOrUsername = await _getDbUserByEmailOrUsername(
      emailOrUsername
    );
    if (!dbUserEmailOrUsername) {
      throw new AppError('User not found');
    }
    const dbUser = await getDbUserById(dbUserEmailOrUsername.userId);
    const code = randomUniqString();
    const resetKey = createKey({ type: 'RESET_PASSWORD_CODE', code });
    const dbResetPasswordCode: DbResetPasswordCode = {
      ...resetKey,
      code,
      userId: dbUser.userId,
      expireAt: Date.now() + getDuration(1, 'd'),
    };
    await putItems(dbResetPasswordCode);
    const url = `${BASE_URL}/reset-password/${code}`;

    await ses
      .sendEmail({
        Source: EMAIL_SENDER,
        Destination: {
          ToAddresses: [dbUser.email],
        },
        Message: {
          Subject: {
            Data: 'Reset your password',
          },
          Body: {
            Html: {
              Data: `
Hi ${dbUser.username},
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
