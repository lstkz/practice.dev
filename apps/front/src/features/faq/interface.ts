import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { FaqSymbol } from './symbol';

// --- Actions ---
export const [handle, FaqActions, getFaqState] = createModule(FaqSymbol)
  .withActions({})
  .withState<FaqState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: ['/faq', '/faq/:slug'],
  component: () => import('./components/FaqView').then(x => x.FaqView),
};

// --- Types ---
export interface FaqState {}
