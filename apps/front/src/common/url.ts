export type UrlOptions =
  | {
      name: 'login';
    }
  | {
      name: 'register';
    }
  | {
      name: 'forgot-password';
    };

export function createUrl(options: UrlOptions) {
  switch (options.name) {
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'forgot-password':
      return '/forgot-password';
  }
}
