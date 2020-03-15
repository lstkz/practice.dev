import { RouteConfig, Challenge, PagedResult, SelectOption } from 'src/types';
import { createModule } from 'typeless';
import { ChallengesSymbol } from './symbol';
import { ChallengeDifficulty, ChallengeDomain, ChallengeTag } from 'shared';

// --- Actions ---
export const [handle, ChallengesActions, getChallengesState] = createModule(
  ChallengesSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    $unmounted: null,
    load: null,
    loaded: (result: PagedResult<Challenge>) => ({ payload: { result } }),
    updateFilter: (name: keyof ChallengesFilter, value: any) => ({
      payload: { name, value },
    }),
    tagsLoaded: (tags: ChallengeTag[]) => ({ payload: { tags } }),
  })
  .withState<ChallengesState>();

// --- Routing ---

const component = () =>
  import(
    /* webpackChunkName: 'challenges' */ './components/ChallengesView'
  ).then(x => x.ChallengesView);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/challenges',
  component,
  waitForAction: ChallengesActions.loaded,
};

// --- Types ---

export interface ChallengesFilter {
  statuses: {
    [x in SolveStatus]?: SolveStatus;
  };
  difficulties: {
    [x in ChallengeDifficulty]?: ChallengeDifficulty;
  };
  domains: {
    [x in ChallengeDomain]?: ChallengeDomain;
  };
  tags: SelectOption<string>[];
  sortOrder: SelectOption<ChallengesSortOrder>;
}

export interface ChallengesState {
  isLoading: boolean;
  total: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  items: Challenge[];
  tags: ChallengeTag[] | null;
}

export type ChallengesSortOrder =
  | 'submissions'
  | 'oldest'
  | 'newest'
  | 'solved';

export type SolveStatus = 'solved' | 'unsolved';
