import { createForm } from 'typeless-form';
import { S } from 'schema';
import { ContactUsFormSymbol } from './symbol';
import { validate } from '../../common/helper';
import { SelectOption } from 'src/types';

export interface ContactUsFormValues {
  email: string;
  message: string;
  category: SelectOption;
}

export const [
  useContactUsForm,
  ContactUsFormActions,
  getContactUsFormState,
  ContactUsFormProvider,
] = createForm<ContactUsFormValues>({
  symbol: ContactUsFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        email: S.string().email(),
        message: S.string(),
        category: S.any(),
      })
    );
  },
});
