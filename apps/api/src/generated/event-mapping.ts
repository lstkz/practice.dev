import { createEventBinding } from '../lib';

type BindingResult = ReturnType<typeof createEventBinding>;

interface EventMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  };
}
export const eventMapping: EventMapping = {
  NewDiscussionEvent: {
    onNewDiscussionEvent: () =>
      import(
        /* webpackChunkName: "NewDiscussionEvent.onNewDiscussionEvent"*/ '../contracts/discussion/onNewDiscussionEvent'
      ).then(x => x['onNewDiscussionEvent']),
  },
  UserRegisteredEvent: {
    sendConfirmEmailEvent: () =>
      import(
        /* webpackChunkName: "UserRegisteredEvent.sendConfirmEmailEvent"*/ '../contracts/notification/sendConfirmEmail'
      ).then(x => x['sendConfirmEmailEvent']),
  },
};
