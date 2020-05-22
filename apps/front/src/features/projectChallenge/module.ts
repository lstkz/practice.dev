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

// --- Epic ---
handle
  .epic()
  .on(ProjectChallengeActions.$mounted, () => {
    return ProjectChallengeActions.load();
  })
  .on(ProjectChallengeActions.load, (_, { action$ }) => {
    const { projectId, id } = getRouteParams('projectChallenge');
    return api
      .project_getProjectChallenge({
        projectId,
        challengeId: id,
      })
      .pipe(
        Rx.mergeMap(challenge =>
          loadBundle(challenge.detailsBundleS3Key).pipe(
            Rx.map(bundle => ProjectChallengeActions.loaded(challenge, bundle))
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
};

handle
  .reducer(initialState)
  .on(ProjectChallengeActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ProjectChallengeActions.loaded, (state, { challenge, component }) => {
    state.challenge = challenge;
    state.testCase = JSON.parse(challenge.testCase);
    state.component = component;
    state.isLoading = false;
  })
  .on(ProjectChallengeActions.changeTab, (state, { tab }) => {
    state.tab = tab;
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
