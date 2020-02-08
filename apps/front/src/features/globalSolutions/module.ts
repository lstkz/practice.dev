import {
  GlobalSolutionsActions,
  GlobalSolutionsState,
  handle,
} from './interface';
import * as Rx from 'src/rx';
import { api } from 'src/services/api';

handle.epic().on(GlobalSolutionsActions.voteSolution, ({ id, like }) => {
  return api
    .solution_voteSolution({
      like,
      solutionId: id,
    })
    .pipe(
      Rx.ignoreElements(),
      Rx.catchLog(() => {
        return Rx.empty();
      })
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
  .on(GlobalSolutionsActions.voteSolution, (state, { id, like }) => {
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
