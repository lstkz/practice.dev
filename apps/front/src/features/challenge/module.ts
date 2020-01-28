import * as Rx from 'src/rx';
import { ChallengeActions, ChallengeState, handle } from './interface';
import { api } from 'src/services/api';
import { getRouteParams } from 'src/common/url';
import { handleAppError } from 'src/common/helper';
import { BUNDLE_BASE_URL } from 'src/config';
import { ActionLike } from 'typeless';

const BUNDLE_ID = 'CHALLENGE_BUNDLE_SCRIPT';

function removeBundle() {
  const existing = document.getElementById(BUNDLE_ID);
  if (existing) {
    existing.remove();
  }
}

// --- Epic ---
handle.epic().on(ChallengeActions.$mounted, (_, { action$ }) => {
  const { id } = getRouteParams('challenge');
  return api.challenge_getChallengeById(id).pipe(
    Rx.mergeMap(challenge => {
      return new Rx.Observable<ActionLike>(subscriber => {
        removeBundle();
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = BUNDLE_BASE_URL + challenge.detailsBundleS3Key;
        document.body.appendChild(script);
        (window as any).ChallengeJSONP = (module: any) => {
          subscriber.next(ChallengeActions.loaded(challenge, module.Details));
          subscriber.complete();
        };
        return () => {
          removeBundle();
        };
      }).pipe(
        Rx.takeUntil(action$.pipe(Rx.waitForType(ChallengeActions.$unmounted)))
      );
    }),
    handleAppError()
  );
});
// .on(ChallengeActions.challengeLoaded, ({ challenge }, { action$ }) => {
//   return new Rx.Observable(subscriber => {
//     removeBundle();
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = BUNDLE_BASE_URL + challenge.detailsBundleS3Key;
//     document.body.appendChild(script);
//     (window as any).ChallengeJSONP = (module: any) => {
//       subscriber.next(ChallengeActions.componentLoaded(module.Details));
//       subscriber.complete();
//     };
//     return () => {
//       removeBundle();
//     };
//   }).pipe(
//     Rx.takeUntil(action$.pipe(Rx.waitForType(ChallengeActions.$unmounted)))
//   );
// });

// --- Reducer ---
const initialState: ChallengeState = {
  isLoading: true,
  challenge: null!,
  component: null!,
};

handle
  .reducer(initialState)
  .on(ChallengeActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ChallengeActions.loaded, (state, { challenge, component }) => {
    state.challenge = challenge;
    state.component = component;
    state.isLoading = false;
  });

// --- Module ---
export function useChallengeModule() {
  handle();
}
