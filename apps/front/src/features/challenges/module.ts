import * as Rx from 'src/rx';
import {
  ChallengesActions,
  ChallengesState,
  handle,
  getChallengesState,
} from './interface';
import { RouterActions } from 'typeless-router';
import { api } from 'src/services/api';

// --- Epic ---
handle
  .epic()
  .on(ChallengesActions.$mounted, () => ChallengesActions.load())
  .on(RouterActions.locationChange, () => ChallengesActions.load())
  .on(ChallengesActions.load, () => {
    const { filter } = getChallengesState();

    return api
      .challenge_searchChallenges({})
      .pipe(Rx.map(ret => ChallengesActions.loaded(ret)));
  });

// --- Reducer ---
const initialState: ChallengesState = {
  isLoading: true,
  filter: {
    status: [],
    difficulties: [],
    domains: [],
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
  });

// --- Module ---
export function useChallengesModule() {
  handle();
}
