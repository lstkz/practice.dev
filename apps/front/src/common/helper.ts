import { getValidateResult, AnySchema } from 'schema';
import * as Rx from 'src/rx';
import { GlobalActions } from 'src/features/global/interface';
import { ActionLike } from 'typeless';
import { AsyncResult } from 'react-select-async-paginate';
import { api } from 'src/services/api';

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

export function searchChallengeTags(
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
    .challengeTags_searchChallengeTags({
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
