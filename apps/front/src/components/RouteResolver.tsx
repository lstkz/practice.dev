import React, { useEffect, useState } from 'react';
import * as R from 'remeda';
import { useActions, useMappedState } from 'typeless';
import { getRouterState, RouterActions, RouterLocation } from 'typeless-router';
import LoadingBar from 'react-top-loading-bar';
import { RouteConfig } from '../types';
import { getGlobalState } from '../features/global/interface';
import { usePrevious } from '../hooks/usePrevious';
import { Theme } from 'src/common/Theme';

// load dynamically all routes from all interfaces
const reqs = [require.context('../features', true, /interface.tsx?$/)];

const routes = R.flatMap(reqs, req =>
  R.flatMap(req.keys(), key => {
    const module = req(key);
    const items = Object.values(module);
    return items.filter(
      (item: any) => item && item.type === 'route'
    ) as RouteConfig[];
  })
);

function matchesRoute(routePath: string | string[], currentPath: string) {
  const routePaths = Array.isArray(routePath) ? routePath : [routePath];
  return routePaths.some(path => {
    const paramReg = /\:[a-zA-Z0-9_\-]+/g;
    const mappedPath = path.replace(paramReg, '([a-zA-Z0-9_\\-]+)');
    const reg = new RegExp(`^${mappedPath}$`);
    return reg.test(currentPath);
  });
}

function getMatch(loc: RouterLocation | null, isLogged: boolean) {
  if (!loc) {
    return null;
  }
  return routes.find(route => {
    if ((route.auth && !isLogged) || (!route.auth && isLogged)) {
      return false;
    }
    return matchesRoute(route.path, loc.pathname);
  });
}

export const RouteResolver = () => {
  const { user, location } = useMappedState(
    [getGlobalState, getRouterState],
    (global, router) => ({
      ...R.pick(global, ['isLoaded', 'user']),
      ...R.pick(router, ['location']),
    })
  );
  const [loadingBarProgress, setLoadingBarProgress] = React.useState(0);
  const { push } = useActions(RouterActions);
  const [component, setComponent] = useState(<div />);
  const loaderRef = React.useRef(null as any);

  const prevUser = usePrevious(user);

  const load = (routeConfig: RouteConfig) => {
    let isStarted = false;
    const startTimeout = setTimeout(() => {
      isStarted = true;
      if (!routeConfig.noLoader) {
        loaderRef.current.continuousStart();
      }
    }, 5);
    routeConfig.component().then(Component => {
      clearTimeout(startTimeout);
      if (!routeConfig.noLoader && isStarted) {
        loaderRef.current.complete();
      }
      setComponent(<Component />);
    });
  };

  useEffect(() => {
    let match = getMatch(location, !!user);
    if (match) {
      load(match);
      return;
    }
    if (!prevUser && user) {
      // user is logging in
      // keep rendering current route if not found
      match = getMatch(location, !user);
      if (match) {
        load(match);
      }
      return;
    }
    // not found route
    // you can display 404 or redirect to default routes
    push(user ? '/' : '/login');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, user]);

  return (
    <>
      <LoadingBar
        ref={loaderRef}
        progress={loadingBarProgress}
        height={3}
        color={Theme.blue}
      />
      {component}
    </>
  );
};
