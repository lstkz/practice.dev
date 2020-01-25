import { createForm } from 'typeless-form';
import { S } from 'schema';
import { LoginFormSymbol } from './symbol';
import { validate } from '../../common/helper';

export interface LoginFormValues {
  emailOrUsername: string;
  password: string;
}

export const [
  useLoginForm,
  LoginFormActions,
  getLoginFormState,
  LoginFormProvider,
] = createForm<LoginFormValues>({
  symbol: LoginFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        emailOrUsername: S.string(),
        password: S.string(),
      })
    );
  },
});
