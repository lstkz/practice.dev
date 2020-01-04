import { S } from 'schema';
import { createContract, createEventBinding, ses } from '../../lib';
import { randomUniqString } from '../../common/helper';
import { getDbUserById } from '../user/getDbUserById';
import { putItems, createKey } from '../../common/db';
import { DbConfirmCode } from '../../types';
import { BASE_URL, EMAIL_SENDER } from '../../config';

export const sendConfirmEmail = createContract('notification.sendConfirmEmail')
  .params('userId', 'registeredAt')
  .schema({
    userId: S.string(),
    registeredAt: S.date(),
  })
  .fn(async (userId, registeredAt) => {
    const code = randomUniqString();
    const dbUser = await getDbUserById(userId);
    const confirmKey = createKey({ type: 'CONFIRM_CODE', code });
    const dbConfirmCode: DbConfirmCode = {
      ...confirmKey,
      userId: dbUser.userId,
      code,
    };
    await putItems(dbConfirmCode);

    const url = `${BASE_URL}/confirm/${code}`;
    await ses
      .sendEmail({
        Source: EMAIL_SENDER,
        Destination: {
          ToAddresses: [dbUser.email],
        },
        Message: {
          Subject: {
            Data: 'Confirm your email',
          },
          Body: {
            Html: {
              Data: `
Hi ${dbUser.username},
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
