import { createForm } from 'typeless-form';
import { S } from 'schema';
import { validate } from '../../common/helper';
import { SolutionFormSymbol } from './symbol';
import { SelectOption } from 'src/types';

export interface SolutionFormValues {
  title: string;
  description: string;
  url: string;
  slug: string;
  tags: SelectOption[];
}

const urlReg = /^https\:\/\/((codesandbox\.io)|(github\.com))/;

export const [
  useSolutionForm,
  SolutionFormActions,
  getSolutionFormState,
  SolutionFormProvider,
] = createForm<SolutionFormValues>({
  symbol: SolutionFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        url: S.string().regex(urlReg),
        title: S.string(),
        description: S.string().optional(),
        slug: S.string().regex(/^[a-z0-9\-]+$/),
        tags: S.array()
          .min(1)
          .max(5),
      })
    );
    if (errors.url?.includes('Must match regex')) {
      errors.url = 'Invalid URL';
    }
    if (errors.slug?.includes('Must match regex')) {
      errors.slug = 'Only "a-z", "0-9" and "-" characters allowed';
    }
  },
});
