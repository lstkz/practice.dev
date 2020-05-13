import {
  GlobalSolutionsActions,
  GlobalSolutionsState,
  handle,
} from './interface';
import * as Rx from 'src/rx';
import { api } from 'src/services/api';
import { getGlobalState, GlobalActions } from '../global/interface';
import { LoginActions } from '../login/interface';

handle.epic().on(GlobalSolutionsActions.voteSolution, ({ id, like }) => {
  const { user } = getGlobalState();
  if (!user) {
    return LoginActions.showModal();
  }
  if (!user.isVerified) {
    return GlobalActions.showVerifyEmailError();
  }
  return Rx.concatObs(
    Rx.of(GlobalSolutionsActions.commitVoteSolution(id, like)),
    api
      .solution_voteSolution({
        like,
        solutionId: id,
      })
      .pipe(
        Rx.ignoreElements(),
        Rx.catchLog(() => {
          return Rx.empty();
        })
      )
  );
});

// --- Reducer ---
const initialState: GlobalSolutionsState = {
  solutionMap: {},
};

handle
  .reducer(initialState)
  .on(GlobalSolutionsActions.addSolutions, (state, { solutions }) => {
    solutions.forEach(item => {
      state.solutionMap[item.id] = item;
    });
  })
  .on(GlobalSolutionsActions.commitVoteSolution, (state, { id, like }) => {
    const solution = state.solutionMap[id];
    if (like) {
      solution.likes++;
      solution.isLiked = true;
    } else {
      solution.likes--;
      solution.isLiked = false;
    }
  });

// --- Module ---
export function useGlobalSolutionsModule() {
  handle();
}
