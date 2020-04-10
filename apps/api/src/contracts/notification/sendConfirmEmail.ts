import { S } from 'schema';
import { createContract, createEventBinding, ses } from '../../lib';
import { randomUniqString } from '../../common/helper';
import { BASE_URL, EMAIL_SENDER } from '../../config';
import { UserEntity, ConfirmCodeEntity } from '../../entities2';

export const sendConfirmEmail = createContract('notification.sendConfirmEmail')
  .params('userId', 'registeredAt')
  .schema({
    userId: S.string(),
    registeredAt: S.date(),
  })
  .fn(async (userId, _) => {
    const code = randomUniqString();
    const user = await UserEntity.getByKey({ userId });
    const confirmCode = new ConfirmCodeEntity({
      userId: user.userId,
      code,
    });
    await confirmCode.insert();

    const url = `${BASE_URL}/confirm/${code}`;
    await ses
      .sendEmail({
        Source: EMAIL_SENDER,
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Subject: {
            Data: 'Confirm your email',
          },
          Body: {
            Html: {
              Data: `
Hi ${user.username},
<br/>
<br/>
Please open the following url to confirm your account:
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

export const sendConfirmEmailEvent = createEventBinding({
  type: 'UserRegisteredEvent',
  handler(event) {
    return sendConfirmEmail(
      event.payload.userId,
      new Date(event.payload.registeredAt)
    );
  },
});
