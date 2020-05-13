import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ContactUsSymbol } from './symbol';

// --- Actions ---
export const [handle, ContactUsActions, getContactUsState] = createModule(
  ContactUsSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    setSubmitted: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
  })
  .withState<ContactUsState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/contact-us',
  component: () =>
    import('./components/ContactUsView').then(x => x.ContactUsView),
};

// --- Types ---
export interface ContactUsState {
  isSubmitting: boolean;
  isSubmitted: boolean;
}
