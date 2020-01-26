import { RouteConfig, Challenge, PagedResult } from 'src/types';
import { createModule } from 'typeless';
import { ChallengesSymbol } from './symbol';
import { ChallengeDifficulty, ChallengeDomain } from 'shared';

// --- Actions ---
export const [handle, ChallengesActions, getChallengesState] = createModule(
  ChallengesSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    load: null,
    loaded: (result: PagedResult<Challenge>) => ({ payload: { result } }),
  })
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
  waitForAction: ChallengesActions.loaded,
};

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/',
  component,
  waitForAction: ChallengesActions.loaded,
};

// --- Types ---
export interface ChallengesState {
  isLoading: boolean;
  total: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  items: Challenge[];
  filter: {
    status: SolveStatus[];
    difficulties: ChallengeDifficulty[];
    domains: ChallengeDomain[];
  };
}

export type SolveStatus = 'solved' | 'unsolved' | 'any';
