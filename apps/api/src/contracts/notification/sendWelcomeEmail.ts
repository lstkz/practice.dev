// import { V } from 'veni';
// import { createContract } from '../../contract';

// export const sendWelcomeEmail = createContract('notification.sendWelcomeEmail')
//   .params('userId', 'registeredAt')
//   .schema({
//     userId: V.number(),
//     registeredAt: V.date(),
//   })
//   .fn(async (userId, registeredAt) => {
//     console.log(
//       `sending welcome email to ${userId}. Delay: ${Date.now() -
//         registeredAt.getTime()}`
//     );
//   })
//   .event({
//     type: 'UserRegisteredEvent',
//     async handler(event) {
//       await sendWelcomeEmail(event.payload.userId, event.payload.registeredAt);
//     },
//   });
