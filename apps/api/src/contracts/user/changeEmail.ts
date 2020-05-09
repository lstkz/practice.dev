import { S } from 'schema';
import { createContract, createRpcBinding, ses } from '../../lib';
import { UserEmailEntity, UserEntity } from '../../entities';
import { AppError } from '../../common/errors';
import { ChangeEmailRequestEntity } from '../../entities/ChangeEmailRequestEntity';
import { randomUniqString, getDuration } from '../../common/helper';
import { BASE_URL, EMAIL_SENDER } from '../../config';

export const changeEmail = createContract('user.changeEmail')
  .params('userId', 'email')
  .schema({
    userId: S.string(),
    email: S.string().email(),
  })
  .fn(async (userId, email) => {
    const [user, isTaken] = await Promise.all([
      UserEntity.getById(userId),
      UserEmailEntity.getIsTaken(email),
    ]);
    if (isTaken) {
      throw new AppError('Email is already taken');
    }
    const code = randomUniqString();
    const changeRequest = new ChangeEmailRequestEntity({
      code,
      email,
      userId,
      expireAt: Date.now() + getDuration(1, 'd'),
    });
    await changeRequest.insert();

    const url = `${BASE_URL}/confirm-email/${code}`;
    await ses
      .sendEmail({
        Source: EMAIL_SENDER,
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Subject: {
            Data: 'Confirm email change',
          },
          Body: {
            Html: {
              Data: `
Hi ${user.username},
<br/>
<br/>
Please open the following url to confirm your new email:
<br/>
<a href="${url}">Confirm Email</a> 

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

export const changeEmailRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.changeEmail',
  handler: changeEmail,
});
