import { createEventBinding } from '../lib';

type BindingResult = ReturnType<typeof createEventBinding>;

interface EventMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  };
}
export const eventMapping: EventMapping = {
  UserRegisteredEvent: {
    sendConfirmEmailEvent: () =>
      import(
        /* webpackChunkName: "UserRegisteredEvent.sendConfirmEmailEvent"*/ '../contracts/notification/sendConfirmEmail'
      ).then(x => x['sendConfirmEmailEvent']),
  },
};
