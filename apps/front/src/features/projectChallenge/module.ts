import * as Rx from 'src/rx';
import {
  ProjectChallengeActions,
  ProjectChallengeState,
  handle,
  routeConfig,
} from './interface';
import { SubmitActions } from '../submit/interface';
import { api } from 'src/services/api';
import { handleAppError, loadBundle } from 'src/common/helper';

// --- Epic ---
handle.epic().onRoute({
  $mounted: ProjectChallengeActions.$mounted,
  routeConfig: routeConfig,
  onParamsChanged: ({ projectId, id }, _, { action$ }) => {
    return api
      .project_getProjectChallenge({
        projectId,
        challengeId: id,
      })
      .pipe(
        Rx.mergeMap(challenge =>
          loadBundle(challenge.detailsBundleS3Key).pipe(
            Rx.mergeMap(bundle => [
              ProjectChallengeActions.loaded(challenge, bundle),
              SubmitActions.reset(),
              SubmitActions.initTarget({
                projectId: challenge.project.id,
                challengeId: challenge.id,
              }),
            ])
          )
        ),
        handleAppError(),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(ProjectChallengeActions.$unmounted))
        )
      );
  },
});

// --- Reducer ---
const initialState: ProjectChallengeState = {
  isLoading: true,
  challenge: null!,
  component: null!,
  tab: 'details',
  testCase: [],
};

handle
  .reducer(initialState)
  .on(ProjectChallengeActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ProjectChallengeActions.loaded, (state, { challenge, component }) => {
    state.challenge = challenge;
    state.tab = 'details';
    state.testCase = JSON.parse(challenge.testCase);
    state.component = component;
    state.isLoading = false;
  })
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
  });

// --- Module ---
export function useProjectChallengeModule() {
  handle();
}
