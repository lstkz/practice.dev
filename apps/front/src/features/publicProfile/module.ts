import * as Rx from 'src/rx';
import {
  PublicProfileActions,
  PublicProfileState,
  handle,
  getPublicProfileState,
} from './interface';
import { getRouteParams, isRoute } from 'src/common/url';
import { api } from 'src/services/api';
import { handleAppError, getErrorMessage } from 'src/common/helper';
import { SolutionsTabActions } from './components/SolutionsTab';
import { LikesTabActions } from './components/LikesTab';
import { RouterActions, getRouterState } from 'typeless-router';

// --- Epic ---
handle
  .epic()
  .on(RouterActions.locationChange, () => {
    const { location, prevLocation } = getRouterState();
    if (location && prevLocation && isRoute('profile', location)) {
      const newUsername = getRouteParams('profile').username;
      if (getPublicProfileState().profile?.username !== newUsername) {
        return PublicProfileActions.load();
      }
    }
    return null;
  })
  .on(PublicProfileActions.$mounted, () => PublicProfileActions.load())
  .on(PublicProfileActions.load, () => {
    const { username } = getRouteParams('profile');

    return api.user_getPublicProfile(username).pipe(
      Rx.map(ret => PublicProfileActions.profileLoaded(ret)),
      Rx.catchError(e => {
        if (getErrorMessage(e) === 'User not found') {
          return Rx.of(PublicProfileActions.setNotFound());
        }
        throw e;
      }),
      handleAppError()
    );
  })
  .on(PublicProfileActions.changeTab, ({ tab }) => {
    if (tab === 'solutions') {
      return SolutionsTabActions.load(false);
    }
    if (tab === 'likes') {
      return LikesTabActions.load(false);
    }
    return Rx.empty();
  });

// --- Reducer ---
const initialState: PublicProfileState = {
  isNotFound: false,
  isLoaded: false,
  profile: null!,
  tab: 'overview',
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
  })
  .on(PublicProfileActions.setNotFound, stats => {
    stats.isNotFound = true;
  });

// --- Module ---
export function usePublicProfileModule() {
  handle();
}
