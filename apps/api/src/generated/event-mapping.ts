import { createEventBinding } from '../lib';

type BindingResult = ReturnType<typeof createEventBinding>;

interface EventMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  };
}
export const eventMapping: EventMapping = {
  UserRegisteredEvent: {
    sendWelcomeEmailEvent: () =>
      import(
        /* webpackChunkName: "UserRegisteredEvent.sendWelcomeEmailEvent"*/ '../contracts/notification/sendWelcomeEmail'
      ).then(x => x['sendWelcomeEmailEvent']),
  },
};
