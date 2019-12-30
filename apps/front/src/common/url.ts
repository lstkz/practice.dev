export type UrlOptions =
  | {
      name: 'login';
    }
  | {
      name: 'register';
    }
  | {
      name: 'forgot-password';
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
    case 'forgot-password':
      return '/forgot-password';
    case 'challenges':
      return '/';
    case 'home':
      return '/';
  }
}
