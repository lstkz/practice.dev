import { getRouterState, RouterLocation } from 'typeless-router';
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

export function isRoute(
  name: 'challenges' | 'register' | 'login' | 'reset-password',
  location?: RouterLocation | null
): boolean {
  const { pathname } = location || getRouterState().location!;
  switch (name) {
    default: {
      return pathname === createUrl({ name });
    }
  }
  return false;
}

export function parseQueryString(qs: string | null | undefined) {
  return (qs || '')
    .replace(/^\?/, '')
    .split('&')
    .reduce((params, param) => {
      const [key, value] = param.split('=');
      if (key) {
        params[key] = value ? decodeURIComponent(value) : '';
      }
      return params;
    }, {} as Record<string, string>);
}

export function stringifyQueryString(
  params: Record<string, string | number>,
  noEncode = false
) {
  if (!params) {
    return '';
  }
  const keys = Object.keys(params).filter(key => key.length > 0);
  if (!keys.length) {
    return '';
  }
  return (
    '?' +
    keys
      .map(key => {
        if (params[key] == null) {
          return key;
        }
        const value = params[key].toString();
        return `${key}=${noEncode ? value : encodeURIComponent(value)}`;
      })
      .join('&')
  );
}

interface ChallengesUrlParams {
  statuses?: string[];
  difficulties?: string[];
  domains?: string[];
  tags?: string[];
  sortOrder?: string;
}

export function createChallengesUrl(params: ChallengesUrlParams) {
  const query: any = {};
  if (params.statuses?.length) {
    query.status = params.statuses.join(',');
  }
  if (params.difficulties?.length) {
    query.difficulty = params.difficulties.join(',');
  }
  if (params.domains?.length) {
    query.domain = params.domains.join(',');
  }
  if (params.tags?.length) {
    query.tags = params.tags.join(',');
  }
  if (params.sortOrder && params.sortOrder !== 'oldest') {
    query.sortOrder = params.sortOrder;
  }
  return {
    pathname: createUrl({ name: 'challenges' }),
    search: stringifyQueryString(query, true),
  };
}

export function createFullChallengesUrl(params: ChallengesUrlParams) {
  const { pathname, search } = createChallengesUrl(params);
  return pathname + search;
}
