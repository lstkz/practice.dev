import * as Rx from 'src/rx';
import {
  ChallengesActions,
  ChallengesState,
  handle,
  getChallengesState,
} from './interface';
import { api } from 'src/services/api';
import { handleAppError } from 'src/common/helper';

// --- Epic ---
handle
  .epic()
  .on(ChallengesActions.$mounted, () => ChallengesActions.load())
  .on(ChallengesActions.updateFilter, () => ChallengesActions.load())
  .on(ChallengesActions.load, () => {
    const { filter } = getChallengesState();
    return api
      .challenge_searchChallenges({
        statuses: Object.values(filter.statuses) as any,
        difficulties: Object.values(filter.difficulties) as any,
        domains: Object.values(filter.domains) as any,
      })
      .pipe(
        Rx.map(ret => ChallengesActions.loaded(ret)),
        handleAppError()
      );
  });

// --- Reducer ---
const initialState: ChallengesState = {
  isLoading: true,
  filter: {
    statuses: {},
    difficulties: {},
    domains: {},
  },
  items: [],
  total: 0,
  pageSize: 0,
  pageNumber: 0,
  totalPages: 0,
};

handle
  .reducer(initialState)
  .on(ChallengesActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ChallengesActions.loaded, (state, { result }) => {
    state.isLoading = false;
    state.items = result.items;
    state.total = result.total;
    state.pageSize = result.pageSize;
    state.pageNumber = result.pageNumber;
    state.totalPages = result.totalPages;
  })
  .on(ChallengesActions.updateFilter, (state, { name, value }) => {
    state.filter[name] = value;
  });

// --- Module ---
export function useChallengesModule() {
  handle();
}
