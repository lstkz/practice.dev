import * as Rx from 'src/rx';
import { ChallengeActions, ChallengeState, handle } from './interface';
import { api } from 'src/services/api';
import { getRouteParams } from 'src/common/url';
import { handleAppError } from 'src/common/helper';
import { BUNDLE_BASE_URL } from 'src/config';
import { ActionLike } from 'typeless';
import { getGlobalState } from '../global/interface';

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
  return Rx.forkJoin([
    api.challenge_getChallengeById(id),
    Rx.defer(() => {
      const { user } = getGlobalState();
      if (!user) {
        return Rx.of([]);
      }
      return api
        .submission_searchSubmissions({
          challengeId: id,
          username: user.username,
          limit: 10,
        })
        .pipe(Rx.map(ret => ret.items));
    }),
  ]).pipe(
    Rx.mergeMap(([challenge, recentSubmissions]) => {
      return new Rx.Observable<ActionLike>(subscriber => {
        removeBundle();
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = BUNDLE_BASE_URL + challenge.detailsBundleS3Key;
        document.body.appendChild(script);
        (window as any).ChallengeJSONP = (module: any) => {
          subscriber.next(
            ChallengeActions.loaded(
              challenge,
              recentSubmissions,
              module.Details
            )
          );
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

// --- Reducer ---
const initialState: ChallengeState = {
  isLoading: true,
  challenge: null!,
  component: null!,
  tab: 'details',
  testCase: [],
  recentSubmissions: [],
};

handle
  .reducer(initialState)
  .on(ChallengeActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(
    ChallengeActions.loaded,
    (state, { challenge, recentSubmissions, component }) => {
      state.challenge = challenge;
      state.recentSubmissions = recentSubmissions;
      state.testCase = JSON.parse(challenge.testCase);
      state.component = component;
      state.isLoading = false;
    }
  )
  .on(ChallengeActions.changeTab, (state, { tab }) => {
    state.tab = tab;
  })
  .on(ChallengeActions.addRecentSubmission, (state, { submission }) => {
    state.recentSubmissions.unshift(submission);
    state.recentSubmissions = state.recentSubmissions.slice(0, 10);
  });

// --- Module ---
export function useChallengeModule() {
  handle();
}
