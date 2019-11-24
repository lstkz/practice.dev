import * as Rx from 'src/rx';
import { GlobalActions, GlobalState, handle } from './interface';
import { RouterActions } from 'typeless-router';
import {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
} from 'src/services/Storage';
import { api } from 'src/services/api';
import { createUrl } from 'src/common/url';

// --- Epic ---
handle
  .epic()
  .on(GlobalActions.$mounted, () => {
    if (getAccessToken()) {
      return api.user_getMe().pipe(
        Rx.map(GlobalActions.loggedIn),
        Rx.catchLog(() => {
          clearAccessToken();
          return Rx.of(GlobalActions.loggedIn(null));
        })
      );
    }
    return GlobalActions.loggedIn(null);
  })
  .on(GlobalActions.logout, () => {
    clearAccessToken();
    return RouterActions.push(createUrl({ name: 'login' }));
  })
  .on(GlobalActions.auth, ({ user, token }) => {
    setAccessToken(token);
    return Rx.from([
      GlobalActions.loggedIn(user),
      RouterActions.push(createUrl({ name: 'challenges' })),
    ]);
  });

// --- Reducer ---
const initialState: GlobalState = {
  isLoaded: false,
  user: null,
};

handle
  .reducer(initialState)
  .on(GlobalActions.loggedIn, (state, { user }) => {
    state.isLoaded = true;
    state.user = user;
  })
  .on(GlobalActions.logout, state => {
    state.user = null;
  });

// --- Module ---
export function useGlobalModule() {
  handle();
}
