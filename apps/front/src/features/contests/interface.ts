import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ContestsSymbol } from './symbol';

// --- Actions ---
export const [handle, ContestsActions, getContestsState] = createModule(
  ContestsSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    setSubmitted: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
  })
  .withState<ContestsState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/contests',
  component: () =>
    import('./components/ContestsView').then(x => x.ContestsView),
};

// --- Types ---
export interface ContestsState {
  isSubmitted: boolean;
  isSubmitting: boolean;
}
