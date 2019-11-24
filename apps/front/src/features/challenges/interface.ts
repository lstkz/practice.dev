import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ChallengesSymbol } from './symbol';

// --- Actions ---
export const [handle, ChallengesActions, getChallengesState] = createModule(
  ChallengesSymbol
)
  .withActions({})
  .withState<ChallengesState>();

// --- Routing ---

const component = () =>
  import(
    /* webpackChunkName: 'challenges' */ './components/ChallengesView'
  ).then(x => x.ChallengesView);

export const anonymousRouteConfig: RouteConfig = {
  type: 'route',
  auth: false,
  path: '/challenges',
  component,
};

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/',
  component,
};

// --- Types ---
export interface ChallengesState {
  foo: string;
}
