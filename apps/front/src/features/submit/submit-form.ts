import { createForm } from 'typeless-form';
import { S } from 'schema';
import { validate } from '../../common/helper';
import { SubmitFormSymbol } from './symbol';
import { urlRegex } from 'shared';

export interface SubmitFormValues {
  url: string;
}

export const [
  useSubmitForm,
  SubmitFormActions,
  getSubmitFormState,
  SubmitFormProvider,
] = createForm<SubmitFormValues>({
  symbol: SubmitFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        url: S.string().regex(urlRegex),
      })
    );
    if (errors.url?.includes('Must match regex')) {
      errors.url = 'Invalid URL';
    }
  },
});
