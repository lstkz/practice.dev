import * as Rx from 'src/rx';
import {
  ProjectChallengeActions,
  ProjectChallengeState,
  handle,
} from './interface';
import { SubmitActions } from '../submit/interface';
import { getRouteParams } from 'src/common/url';
import { api } from 'src/services/api';
import { handleAppError, loadBundle } from 'src/common/helper';
import { getGlobalState } from '../global/interface';

// --- Epic ---
handle
  .epic()
  .on(ProjectChallengeActions.$mounted, () => {
    return ProjectChallengeActions.load();
  })
  .on(ProjectChallengeActions.load, (_, { action$ }) => {
    const { projectId, id } = getRouteParams('projectChallenge');
    return Rx.forkJoin([
      api.project_getProjectChallenge({
        projectId,
        challengeId: id,
      }),
      Rx.defer(() => {
        const { user } = getGlobalState();
        if (!user) {
          return Rx.of([]);
        }
        return api
          .submission_searchSubmissions({
            projectId,
            challengeId: id,
            username: user.username,
            limit: 10,
          })
          .pipe(Rx.map(ret => ret.items));
      }),
    ]).pipe(
      Rx.mergeMap(([challenge, recentSubmissions]) =>
        loadBundle(challenge.detailsBundleS3Key).pipe(
          Rx.map(bundle =>
            ProjectChallengeActions.loaded(challenge, recentSubmissions, bundle)
          )
        )
      ),
      handleAppError(),
      Rx.takeUntil(
        action$.pipe(Rx.waitForType(ProjectChallengeActions.$unmounted))
      )
    );
  });

// --- Reducer ---
const initialState: ProjectChallengeState = {
  isLoading: true,
  challenge: null!,
  component: null!,
  tab: 'details',
  testCase: [],
  recentSubmissions: [],
};

handle
  .reducer(initialState)
  .on(ProjectChallengeActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(
    ProjectChallengeActions.loaded,
    (state, { challenge, component, recentSubmissions }) => {
      state.challenge = challenge;
      state.testCase = JSON.parse(challenge.testCase);
      state.component = component;
      state.recentSubmissions = recentSubmissions;
      state.isLoading = false;
    }
  )
  .on(ProjectChallengeActions.changeTab, (state, { tab }) => {
    state.tab = tab;
  })
  .on(SubmitActions.started, state => {
    state.tab = 'testSuite';
  })
  .on(SubmitActions.testingDone, (state, { success }) => {
    if (success) {
      state.challenge.isSolved = success;
    }
  })
  .on(SubmitActions.newSubmission, (state, { submission }) => {
    state.recentSubmissions.unshift(submission);
    state.recentSubmissions = state.recentSubmissions.slice(0, 10);
  });

// --- Module ---
export function useProjectChallengeModule() {
  handle();
}
