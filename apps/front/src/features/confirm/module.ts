import { ConfirmActions, handle } from './interface';
import * as Rx from 'src/rx';
import { getRouteParams, createUrl } from 'src/common/url';
import { api } from 'src/services/api';
import { handleAppError } from 'src/common/helper';
import { RouterActions } from 'typeless-router';
import { GlobalActions } from '../global/interface';

// --- Epic ---
handle.epic().on(ConfirmActions.$mounted, () => {
  const { code } = getRouteParams('confirm');
  return api.user_confirmEmail(code).pipe(
    Rx.map(auth => GlobalActions.auth(auth)),
    handleAppError(),
    Rx.concat(Rx.of(RouterActions.push(createUrl({ name: 'challenges' }))))
  );
});

// --- Module ---
export function useConfirmModule() {
  handle();
}
