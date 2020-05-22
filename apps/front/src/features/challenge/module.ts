import * as Rx from 'src/rx';
import { ChallengeActions, ChallengeState, handle } from './interface';
import { api } from 'src/services/api';
import { getRouteParams, parseQueryString, createUrl } from 'src/common/url';
import { handleAppError, loadBundle } from 'src/common/helper';
import { getGlobalState, GlobalActions } from '../global/interface';
import { SubmitActions } from '../submit/interface';
import { RouterActions, getRouterState } from 'typeless-router';
import {
  GlobalSolutionsActions,
  getGlobalSolutionsState,
} from '../globalSolutions/interface';
import { SolutionActions, getSolutionState } from '../solution/interface';
import { SolutionsTabActions } from './components/SolutionsTab';

function checkSolutionModal() {
  const { location } = getRouterState();
  if (!location) {
    return Rx.empty();
  }
  const query = parseQueryString(location.search);
  if (query.s) {
    const { id } = getRouteParams('challenge');
    const solutions = Object.values(getGlobalSolutionsState().solutionMap);
    const solution = solutions.find(
      x => x.challengeId === id && x.slug === query.s
    );
    if (solution) {
      return SolutionActions.show('view', solution);
    } else {
      return SolutionActions.loadSolutionBySlug(id, query.s);
    }
  } else {
    if (getSolutionState().isOpened) {
      return SolutionActions.close();
    }
  }
  return Rx.empty();
}

// --- Epic ---
handle
  .epic()
  .on(RouterActions.locationChange, () => {
    return checkSolutionModal();
  })
  .on(ChallengeActions.$mounted, () => {
    return checkSolutionModal();
  })
  .on(ChallengeActions.$mounted, () => {
    return ChallengeActions.load();
  })
  .on(GlobalActions.auth, () => ChallengeActions.load())
  .on(ChallengeActions.load, (_, { action$ }) => {
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
      api.solution_searchSolutions({
        challengeId: id,
        sortBy: 'likes',
        sortDesc: true,
        limit: 5,
      }),
    ]).pipe(
      Rx.mergeMap(([challenge, recentSubmissions, solutions]) =>
        loadBundle(challenge.detailsBundleS3Key).pipe(
          Rx.mergeMap(bundle => [
            GlobalSolutionsActions.addSolutions(solutions.items),
            ChallengeActions.loaded(
              challenge,
              recentSubmissions,
              solutions.items.map(x => x.id),
              bundle
            ),
          ])
        )
      ),
      handleAppError(),
      Rx.takeUntil(action$.pipe(Rx.waitForType(ChallengeActions.$unmounted)))
    );
  })
  .on(SolutionActions.close, () => {
    const query = parseQueryString(location.search);
    if (query.s) {
      return RouterActions.push(
        createUrl({
          name: 'challenge',
          id: getRouteParams('challenge').id,
        })
      );
    } else {
      return Rx.empty();
    }
  })
  .on(ChallengeActions.showSolutionsWithTag, ({ tag }) => {
    return [
      SolutionsTabActions.showByTag(tag),
      ChallengeActions.changeTab('solutions'),
    ];
  });

// --- Reducer ---
const initialState: ChallengeState = {
  isLoading: true,
  challenge: null!,
  component: null!,
  tab: 'details',
  testCase: [],
  recentSubmissions: [],
  favoriteSolutions: [],
};

handle
  .reducer(initialState)
  .on(ChallengeActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(
    ChallengeActions.loaded,
    (state, { challenge, recentSubmissions, favoriteSolutions, component }) => {
      state.challenge = challenge;
      state.recentSubmissions = recentSubmissions;
      state.favoriteSolutions = favoriteSolutions;
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
  })
  .on(SubmitActions.testingDone, (state, { success }) => {
    if (success) {
      state.challenge.isSolved = success;
    }
  })
  .on(GlobalSolutionsActions.removeSolution, (state, { id }) => {
    state.favoriteSolutions = state.favoriteSolutions.filter(x => x !== id);
  });

// --- Module ---
export function useChallengeModule() {
  handle();
}
