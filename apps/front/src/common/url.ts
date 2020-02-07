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
      solutionSlug?: string;
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
    case 'challenge': {
      let url = '/challenges/' + options.id;
      if (options.solutionSlug) {
        url += '?s=' + options.solutionSlug;
      }
      return url;
    }
    case 'projects':
      return '/projects';
    case 'home':
      return '/challenges';
  }
}

export function getRouteParams(name: 'reset-password'): { code: string };
export function getRouteParams(name: 'challenge'): { id: number };
export function getRouteParams(name: 'confirm'): { code: string };
export function getRouteParams(
  name: 'reset-password' | 'challenge' | 'confirm'
): any {
  const location = getRouterState().location!;
  const getLast = () => R.last(location.pathname.split('/'));
  switch (name) {
    case 'confirm':
    case 'reset-password': {
      return {
        code: getLast(),
      };
    }
    case 'challenge': {
      return {
        id: Number(getLast()),
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
