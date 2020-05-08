import * as Rx from 'src/rx';
import { api } from 'src/services/api';
import { SettingsActions, SettingsState, handle } from './interface';
import { handleAppError, countryListItemToOption } from 'src/common/helper';
import { getGlobalState, GlobalActions } from '../global/interface';
import { PublicProfileFormActions } from './components/PublicProfileSection';
import { countryList } from 'shared';

function _getCountryOption(code: string | null) {
  if (!code) {
    return null;
  }
  const item = countryList.find(x => x.code === code);
  if (!item) {
    return null;
  }
  return countryListItemToOption(item);
}

// --- Epic ---
handle.epic().on(SettingsActions.$mounted, () =>
  api.user_getPublicProfile(getGlobalState().user!.username).pipe(
    Rx.mergeMap(ret => [
      SettingsActions.profileLoaded(ret),
      PublicProfileFormActions.reset(),
      PublicProfileFormActions.changeMany({
        bio: ret.bio,
        name: ret.name,
        url: ret.url,
        country: _getCountryOption(ret.country),
      }),
    ]),
    handleAppError()
  )
);

// --- Reducer ---
const initialState: SettingsState = {
  isLoaded: false,
  tab: 'profile',
  profile: null!,
};

handle
  .reducer(initialState)
  .on(SettingsActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(SettingsActions.profileLoaded, (stats, { profile }) => {
    stats.isLoaded = true;
    stats.profile = profile;
  })
  .on(SettingsActions.changeTab, (state, { tab }) => {
    state.tab = tab;
  })
  .on(GlobalActions.avatarUpdated, (state, { avatarUrl }) => {
    state.profile.avatarUrl = avatarUrl;
  });

// --- Module ---
export function useSettingsModule() {
  handle();
}
