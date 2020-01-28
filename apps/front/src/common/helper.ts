import { S, getValidateResult, AnySchema } from 'schema';
import * as Rx from 'src/rx';
import { GlobalActions } from 'src/features/global/interface';
import { ActionLike } from 'typeless';

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
    console.error(e);
    return Rx.of(GlobalActions.showAppError(getErrorMessage(e)));
  });
