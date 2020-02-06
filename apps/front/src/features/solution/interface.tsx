import { createModule } from 'typeless';
import { SolutionSymbol } from './symbol';

export const [handle, SolutionActions, getSolutionState] = createModule(
  SolutionSymbol
)
  .withState<SolutionState>()
  .withActions({
    $init: null,
    show: null,
    close: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setError: (error: string | null) => ({ payload: { error } }),
  });

// --- Types ---
export interface SolutionState {
  error: string | null;
  isSubmitting: boolean;
  isOpened: boolean;
}
