import { getRouterState } from 'typeless-router';
import * as R from 'remeda';

export type UrlOptions =
  | {
      name: 'login';
    }
  | {
      name: 'register';
    }
  | {
      name: 'reset-password';
    }
  | {
      name: 'challenges';
    }
  | {
      name: 'home';
    };

export function createUrl(options: UrlOptions) {
  switch (options.name) {
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'reset-password':
      return '/reset-password';
    case 'challenges':
      return '/';
    case 'home':
      return '/';
  }
}

export function getRouteParams(name: 'reset-password'): { code: string };
export function getRouteParams(name: 'reset-password'): any {
  const location = getRouterState().location!;
  switch (name) {
    case 'reset-password': {
      const split = location.pathname.split('/');
      return {
        code: R.last(split),
      };
    }
  }
}
