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
      name: 'challenge';
      id: number;
    }
  | {
      name: 'projects';
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
      return '/challenges';
    case 'challenge':
      return '/challenges/' + options.id;
    case 'projects':
      return '/projects';
    case 'home':
      return '/';
  }
}

export function getRouteParams(name: 'reset-password'): { code: string };
export function getRouteParams(name: 'challenge'): { id: number };
export function getRouteParams(name: 'reset-password' | 'challenge'): any {
  const location = getRouterState().location!;
  switch (name) {
    case 'reset-password': {
      const split = location.pathname.split('/');
      return {
        code: R.last(split),
      };
    }
    case 'challenge': {
      const split = location.pathname.split('/');
      return {
        id: Number(R.last(split)),
      };
    }
  }
}

export function isRoute(name: 'challenges'): boolean;
export function isRoute(name: 'challenges'): boolean {
  const location = getRouterState().location!;
  switch (name) {
    case 'challenges': {
      return location.pathname === createUrl({ name });
    }
  }
  return false;
}
