import { createForm } from 'typeless-form';
import { S } from 'schema';
import { RegisterFormSymbol } from './symbol';
import { validate } from '../../common/helper';
import { getPasswordSchema, getUsernameSchema } from 'shared';

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const [
  useRegisterForm,
  RegisterFormActions,
  getRegisterFormState,
  RegisterFormProvider,
] = createForm<RegisterFormValues>({
  symbol: RegisterFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        username: getUsernameSchema(),
        email: S.string().email(),
        password: getPasswordSchema(),
        confirmPassword: S.string(),
      })
    );
    if (
      !errors.password &&
      !errors.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match';
    }
  },
});
