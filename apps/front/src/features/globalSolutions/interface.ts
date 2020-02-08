import { createModule } from 'typeless';
import { GlobalSolutionsSymbol } from './symbol';
import { Solution } from 'shared';

// --- Actions ---
export const [
  handle,
  GlobalSolutionsActions,
  getGlobalSolutionsState,
] = createModule(GlobalSolutionsSymbol)
  .withActions({
    addSolutions: (solutions: Solution[]) => ({ payload: { solutions } }),
    voteSolution: (id: string, like: boolean) => ({
      payload: { id, like },
    }),
  })
  .withState<GlobalSolutionsState>();

// --- Types ---
export interface GlobalSolutionsState {
  solutionMap: {
    [x: string]: Solution;
  };
}
