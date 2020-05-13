import { getValidateResult, AnySchema } from 'schema';
import * as Rx from 'src/rx';
import { GlobalActions } from 'src/features/global/interface';
import { ActionLike } from 'typeless';
import { AsyncResult } from 'react-select-async-paginate';
import { api } from 'src/services/api';
import { AuthData } from 'shared';
import { RouterActions } from 'typeless-router';
import { BUNDLE_BASE_URL } from 'src/config';

function fixErrorMessage(message: string) {
  if (message === 'is required') {
    return 'This field is required';
  }

  return message[0].toUpperCase() + message.slice(1);
}

export function validate(
  errors: any,
  values: any,
  schema: AnySchema<any, any>
) {
  getValidateResult(values, schema).errors.reduce((ret, err) => {
    ret[err.path[0]] = fixErrorMessage(err.message);
    return ret;
  }, errors as any);
}

export function getErrorMessage(e: any) {
  if (e?.status === 0) {
    return 'Cannot connect to API';
  }
  const message = e?.response?.error || e.message;
  return message.replace('ContractError: ', '');
}

export const handleAppError = () =>
  Rx.catchLog<ActionLike, Rx.Observable<ActionLike>>((e: any) => {
    return Rx.of(GlobalActions.showAppError(getErrorMessage(e)));
  });

export function searchSolutionTags(
  challengeId: number,
  keyword: string,
  cursor: string | null,
  resolve: (
    result: AsyncResult<{
      label: string;
      value: string;
    }>
  ) => void
) {
  return api
    .solutionTags_searchSolutionTags({
      challengeId,
      cursor,
      keyword,
    })
    .pipe(
      Rx.mergeMap(ret => {
        const options = ret.items.map(x => ({
          label: `${x.name} (${x.count})`,
          value: x.name,
        }));
        resolve({
          options,
          hasMore: !!ret.cursor,
          additional: ret.cursor,
        });
        return Rx.empty();
      }),
      Rx.catchLog(() => {
        return Rx.empty();
      })
    );
}

interface HandleAuthOptions {
  authData: AuthData;
  isModalOpen: boolean;
  hideModal: () => any;
  reset: () => any;
  action$: Rx.Observable<any>;
}

export function handleAuth(options: HandleAuthOptions) {
  const { authData, isModalOpen, hideModal, reset, action$ } = options;
  return Rx.mergeObs(
    Rx.defer(() => {
      if (isModalOpen) {
        return Rx.of(reset());
      } else {
        return action$.pipe(
          Rx.waitForType(RouterActions.locationChange),
          Rx.map(() => reset())
        );
      }
    }).pipe(Rx.delay(1000)),
    Rx.defer(() => {
      if (isModalOpen) {
        return [GlobalActions.auth(authData, true), hideModal()];
      }
      return [GlobalActions.auth(authData)];
    })
  );
}

export function getSolutionsSortCriteria(
  sortOrder: 'likes' | 'newest' | 'oldest'
) {
  return sortOrder === 'newest'
    ? {
        sortBy: 'date' as const,
        sortDesc: true,
      }
    : sortOrder === 'oldest'
    ? {
        sortBy: 'date' as const,
        sortDesc: false,
      }
    : {
        sortBy: 'likes' as const,
        sortDesc: true,
      };
}

export function getAvatarUrl(
  avatarUrl: string | null,
  size: 'sm' | 'lg' = 'sm'
) {
  if (!avatarUrl) {
    return null;
  }
  return (
    BUNDLE_BASE_URL +
    `avatars/${avatarUrl}-${size == 'sm' ? '80x80' : '280x280'}.png`
  );
}

export function countryListItemToOption({
  code,
  name,
  emoji,
}: {
  code: string;
  name: string;
  emoji: string;
}) {
  return {
    value: code,
    label: `${emoji} ${name}`,
  };
}
