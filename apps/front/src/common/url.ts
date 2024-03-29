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
      name: 'project';
      id: number;
    }
  | {
      name: 'project-challenge';
      projectId: number;
      id: number;
    }
  | {
      name: 'contests';
    }
  | {
      name: 'home';
    }
  | {
      name: 'profile';
      username: string;
    }
  | {
      name: 'settings';
    }
  | {
      name: 'contact-us';
    }
  | {
      name: 'faq';
      slug?: string;
    }
  | {
      name: 'tos';
    }
  | {
      name: 'privacy';
    };

export function createUrl(options: UrlOptions) {
  switch (options.name) {
    case 'challenge': {
      let url = '/challenges/' + options.id;
      if (options.solutionSlug) {
        url += '?s=' + options.solutionSlug;
      }
      return url;
    }
    case 'project': {
      let url = '/projects/' + options.id;
      return url;
    }
    case 'project-challenge': {
      let url = `/projects/${options.projectId}/challenges/${options.id}`;
      return url;
    }
    case 'home':
      return '/challenges';
    case 'tos':
      return '/terms';
    case 'profile':
      return '/profile/' + options.username;
    case 'faq': {
      if (options.slug) {
        return '/faq/' + options.slug;
      }
      return '/faq';
    }
    default:
      return '/' + options.name;
  }
}

export function getRouteParams(name: 'reset-password'): { code: string };
export function getRouteParams(name: 'challenge'): { id: number };
export function getRouteParams(name: 'project'): { id: number };
export function getRouteParams(
  name: 'projectChallenge'
): { id: number; projectId: number };
export function getRouteParams(name: 'confirm'): { code: string };
export function getRouteParams(name: 'confirm-change-email'): { code: string };
export function getRouteParams(name: 'profile'): { username: string };
export function getRouteParams(name: 'faq'): { slug: string | null };
export function getRouteParams(
  name:
    | 'reset-password'
    | 'challenge'
    | 'project'
    | 'confirm'
    | 'profile'
    | 'confirm-change-email'
    | 'faq'
    | 'projectChallenge'
): any {
  const location = getRouterState().location!;
  const getLast = () => R.last(location.pathname.split('/'));
  switch (name) {
    case 'confirm':
    case 'confirm-change-email':
    case 'reset-password': {
      return {
        code: getLast(),
      };
    }
    case 'project':
    case 'challenge': {
      return {
        id: Number(getLast()),
      };
    }
    case 'projectChallenge': {
      const [, , projectId, , challengeId] = location.pathname.split('/');
      return {
        projectId: Number(projectId),
        id: Number(challengeId),
      };
    }
    case 'profile': {
      return {
        username: getLast(),
      };
    }
    case 'faq': {
      return {
        slug: location.pathname === '/faq' ? null : getLast(),
      };
    }
  }
}

export function isRoute(
  name:
    | 'challenges'
    | 'register'
    | 'login'
    | 'reset-password'
    | 'challenge'
    | 'profile'
    | 'faq'
    | 'projects',
  location?: RouterLocation | null
): boolean {
  const { pathname } = location || getRouterState().location!;
  switch (name) {
    case 'challenge': {
      return pathname.startsWith('/challenges/');
    }
    case 'profile': {
      return pathname.startsWith('/profile/');
    }
    case 'faq': {
      return pathname === '/faq' || pathname.startsWith('/faq/');
    }
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

interface ProjectsUrlParams {
  statuses?: string[];
  domains?: string[];
  sortOrder?: string;
}
export function createProjectsUrl(params: ProjectsUrlParams) {
  const query: any = {};
  if (params.statuses?.length) {
    query.status = params.statuses.join(',');
  }
  if (params.domains?.length) {
    query.domain = params.domains.join(',');
  }
  if (params.sortOrder && params.sortOrder !== 'oldest') {
    query.sortOrder = params.sortOrder;
  }
  return {
    pathname: createUrl({ name: 'projects' }),
    search: stringifyQueryString(query, true),
  };
}

export function createFullProjectsUrl(params: ProjectsUrlParams) {
  const { pathname, search } = createProjectsUrl(params);
  return pathname + search;
}
