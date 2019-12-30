import { RouteConfig } from '../../types';

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: false,
  path: '/',
  component: () =>
    import(/* webpackChunkName: 'landing' */ './components/LandingView').then(
      x => x.LandingView
    ),
  noLoader: true,
};
