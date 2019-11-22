import { S } from 'schema';
import { createContract, createEventBinding } from '../../lib';

export const sendWelcomeEmail = createContract('notification.sendWelcomeEmail')
  .params('userId', 'registeredAt')
  .schema({
    userId: S.string(),
    registeredAt: S.date(),
  })
  .fn(async (userId, registeredAt) => {
    console.log(
      `sending welcome email to ${userId}. Delay: ${Date.now() -
        registeredAt.getTime()}`
    );
  });

export const sendWelcomeEmailEvent = createEventBinding({
  type: 'UserRegisteredEvent',
  handler(event) {
    return sendWelcomeEmail(
      event.payload.userId,
      new Date(event.payload.registeredAt)
    );
  },
});
