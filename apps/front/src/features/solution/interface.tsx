import { createModule } from 'typeless';
import { SolutionSymbol } from './symbol';
import { Solution } from 'shared';

export const [handle, SolutionActions, getSolutionState] = createModule(
  SolutionSymbol
)
  .withState<SolutionState>()
  .withActions({
    $init: null,
    show: (mode: Mode, solution: Solution | null) => ({
      payload: { mode, solution },
    }),
    close: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setError: (error: string | null) => ({ payload: { error } }),
  });

// --- Types ---
export interface SolutionState {
  error: string | null;
  isSubmitting: boolean;
  isOpened: boolean;
  solution: Solution | null;
  mode: Mode;
}

type Mode = 'view' | 'edit';
