import { S } from 'schema';
import { createContract, createRpcBinding, ses } from '../../lib';
import { EMAIL_SENDER, CONTACT_EMAIL } from '../../config';
import { UserEntity } from '../../entities';

export const sendContact = createContract('contact.sendContact')
  .params('userId', 'values')
  .schema({
    userId: S.string().optional(),
    values: S.object().keys({
      email: S.string().email(),
      category: S.string(),
      message: S.string(),
    }),
  })
  .fn(async (userId, values) => {
    const user = userId ? await UserEntity.getById(userId) : null;

    await ses
      .sendEmail({
        Source: EMAIL_SENDER,
        Destination: {
          ToAddresses: [CONTACT_EMAIL],
        },
        Message: {
          Subject: {
            Data: 'New Contact',
          },
          Body: {
            Html: {
              Data: `
username: ${user?.username ?? '-'}
<br />
name: ${user?.name ?? '-'}
<br />
email: ${values.email}
<br />
category: ${values.category}
<br />
message:<br />
${values.message}
              `.trim(),
            },
          },
        },
      })
      .promise();
  });

export const sendContactRpc = createRpcBinding({
  injectUser: true,
  signature: 'contact.sendContact',
  handler: sendContact,
});
