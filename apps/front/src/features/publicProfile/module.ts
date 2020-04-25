import * as Rx from 'src/rx';
import {
  PublicProfileActions,
  PublicProfileState,
  handle,
  getPublicProfileState,
} from './interface';
import { getRouteParams } from 'src/common/url';
import { api } from 'src/services/api';
import { handleAppError, getSolutionsSortCriteria } from 'src/common/helper';

// --- Epic ---
handle
  .epic()
  .on(PublicProfileActions.$mounted, () => {
    const { username } = getRouteParams('profile');

    return api.user_getPublicProfile(username).pipe(
      Rx.map(ret => PublicProfileActions.profileLoaded(ret)),
      handleAppError()
    );
  })
  .on(PublicProfileActions.changeTab, ({ tab }) => {
    if (tab === 'solutions' && !getPublicProfileState().solutions.isLoaded) {
      return PublicProfileActions.loadSolutions(false);
    }
    return Rx.empty();
  })
  .on(PublicProfileActions.loadSolutions, ({ loadMore }, { action$ }) => {
    const { username } = getRouteParams('profile');
    const { solutions } = getPublicProfileState();

    const search = () =>
      api
        .solution_searchSolutions({
          username,
          ...getSolutionsSortCriteria(solutions.sortOrder.value),
        })
        .pipe(
          Rx.map(ret => PublicProfileActions.solutionsLoaded(loadMore, ret)),
          handleAppError(),
          Rx.takeUntil(
            action$.pipe(Rx.waitForType(PublicProfileActions.loadSolutions))
          )
        );

    return loadMore ? Rx.concatObs(search()) : search();
  });

// --- Reducer ---
const initialState: PublicProfileState = {
  isLoaded: false,
  profile: null!,
  tab: 'overview',
  solutions: {
    sortOrder: {
      label: 'Most Likes',
      value: 'likes',
    },
    isLoaded: false,
    isLoading: false,
    items: [],
    cursor: null,
  },
};

handle
  .reducer(initialState)
  .on(PublicProfileActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(PublicProfileActions.profileLoaded, (stats, { profile }) => {
    stats.isLoaded = true;
    stats.profile = profile;
  })
  .on(PublicProfileActions.changeTab, (stats, { tab }) => {
    stats.tab = tab;
  });

// --- Module ---
export function usePublicProfileModule() {
  handle();
}
