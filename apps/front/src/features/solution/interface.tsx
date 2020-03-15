import { createModule } from 'typeless';
import { SolutionSymbol } from './symbol';
import { Solution, ChallengeTag } from 'shared';
import { AsyncResult } from 'react-select-async-paginate';

export const [handle, SolutionActions, getSolutionState] = createModule(
  SolutionSymbol
)
  .withState<SolutionState>()
  .withActions({
    $init: null,
    show: (mode: Mode, solution: Solution | null) => ({
      payload: { mode, solution },
    }),
    showViewMode: null,
    loadSolutionBySlug: (challengeId: number, slug: string) => ({
      payload: {
        challengeId,
        slug,
      },
    }),
    close: null,
    remove: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setError: (error: string | null) => ({ payload: { error } }),
    searchTags: (
      keyword: string,
      cursor: string | null,
      resolve: (
        result: AsyncResult<{
          label: string;
          value: string;
        }>
      ) => void
    ) => ({
      payload: {
        keyword,
        cursor,
        resolve,
      },
    }),
    created: null,
  });

// --- Types ---
export interface SolutionState {
  error: string | null;
  isSubmitting: boolean;
  isOpened: boolean;
  isLoading: boolean;
  solutionId: string | null;
  mode: Mode;
  tags: {
    cursor: string | null;
    items: ChallengeTag[];
    isLoaded: boolean;
    keyword: string;
  };
}

type Mode = 'view' | 'edit';
