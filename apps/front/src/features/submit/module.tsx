import * as Rx from 'src/rx';
import {
  handle,
  SubmitActions,
  SubmitState,
  getSubmitState,
} from './interface';
import {
  useSubmitForm,
  SubmitFormActions,
  getSubmitFormState,
} from './submit-form';
import { getAccessToken } from 'src/services/Storage';
import { SocketMessage, updateTestResult } from 'shared';
import { api } from 'src/services/api';
import { getChallengeState, ChallengeActions } from '../challenge/interface';
import { ActionLike } from 'typeless';

const SOCKET_URL = 'wss://14vxhhjrtl.execute-api.eu-central-1.amazonaws.com';

handle
  .epic()
  .on(SubmitActions.connect, (_, { action$ }) => {
    return new Rx.Observable<ActionLike>(subscriber => {
      const ws = new WebSocket(
        `${SOCKET_URL}/socket?token=${getAccessToken()}`
      );
      ws.onerror = e => {
        console.error(e);
        subscriber.next(SubmitActions.setError('Cannot connect to server'));
      };
      ws.onopen = () => {
        subscriber.next(SubmitActions.connected());
      };
      const subject = new Rx.Subject<ActionLike>();

      let lastEmit = 0;
      const waitTime = 100;
      const subscription = subject
        .pipe(
          Rx.mergeMap(value => {
            const diff = Date.now() - lastEmit;
            if (diff > 0) {
              lastEmit = Date.now() + waitTime;
              return Rx.of(value);
            } else {
              lastEmit += waitTime;
              return Rx.of(value).pipe(Rx.delay(diff + waitTime));
            }
          })
        )
        .subscribe(subscriber);

      ws.onmessage = event => {
        const data = JSON.parse(event.data);
        const items: SocketMessage[] = Array.isArray(data) ? data : [data];
        items.forEach(item => {
          if (item.meta.id !== getSubmitState().submissionId) {
            return;
          }
          subject.next(SubmitActions.socketMessages([item]));
          if (item.type === 'RESULT') {
            subject.next(SubmitActions.testingDone(item.payload.success));
            subject.next(SubmitActions.disconnect());
          }
        });
      };
      return () => {
        subscription.unsubscribe();
        ws.close();
      };
    }).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(SubmitActions.disconnect))));
  })
  .on(SubmitFormActions.setSubmitSucceeded, (_, { action$ }) => {
    const { values } = getSubmitFormState();

    return Rx.concatObs(
      Rx.of(SubmitActions.setError(null)),
      Rx.of(SubmitActions.setIsSubmitting(true)),
      Rx.concatObs(
        Rx.of(SubmitActions.connect()),
        action$.pipe(
          Rx.waitForType(SubmitActions.connected),
          Rx.ignoreElements()
        ),
        api
          .challenge_submit({
            challengeId: getChallengeState().challenge.id,
            testUrl: values.url,
          })
          .pipe(
            Rx.mergeMap(({ id }) => {
              return [
                SubmitActions.setSubmissionId(id),
                SubmitActions.close(),
                ChallengeActions.changeTab('testSuite'),
              ];
            }),
            Rx.catchLog(e => Rx.of(SubmitActions.setError(e.message)))
          )
      ).pipe(
        Rx.takeUntil(action$.pipe(Rx.waitForType(SubmitActions.setError)))
      ),
      Rx.of(SubmitActions.setIsSubmitting(false))
    );
  })
  .on(SubmitActions.show, () => [
    SubmitFormActions.reset(),
    SubmitActions.setError(null),
  ]);

// --- Reducer ---
const initialState: SubmitState = {
  isOpened: false,
  error: '',
  result: null,
  status: 'none',
  tests: [],
  submissionId: null,
  isSubmitting: false,
};

handle
  .reducer(initialState)
  .on(SubmitActions.setError, (state, { error }) => {
    state.error = error;
  })
  .on(SubmitActions.retry, state => {
    state.result = null;
    state.tests = [];
  })
  .on(SubmitActions.show, state => {
    state.isOpened = true;
  })
  .on(SubmitActions.close, state => {
    state.isOpened = false;
  })
  .on(SubmitActions.setSubmissionId, (state, { submissionId }) => {
    state.submissionId = submissionId;
  })
  .on(SubmitActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(SubmitActions.socketMessages, (state, { messages }) => {
    console.log(messages);
    messages.forEach(msg => {
      updateTestResult(state, msg);

      switch (msg.type) {
        case 'TEST_INFO': {
          state.status = 'testing';
          break;
        }
        case 'RESULT': {
          state.status = 'done';
        }
      }
    });
  });

// --- Module ---
export function useSubmitModule() {
  handle();
  useSubmitForm();
}
