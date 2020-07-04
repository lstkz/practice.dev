import React from 'react';

interface State {
  pathname: string;
  push(pathname: string): void;
}

const RouterContext = React.createContext<State>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = React.useState(location.pathname);
  const onChange = () => {
    setPathname(location.pathname);
  };

  React.useEffect(() => {
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
    };
  }, []);

  const push = React.useCallback((newPathname: string) => {
    console.log('push', newPathname);
    setPathname(newPathname);
    history.pushState(null, '', newPathname);
  }, []);

  return (
    <RouterContext.Provider
      value={{
        pathname,
        push,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return React.useContext(RouterContext);
}
