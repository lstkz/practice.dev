import React, { useEffect, useState } from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { useActions, useMappedState, getIsHmr } from 'typeless';
import { getRouterState, RouterActions, RouterLocation } from 'typeless-router';
import LoadingBar from 'react-top-loading-bar';
import { RouteConfig } from '../types';
import { getGlobalState } from '../features/global/interface';
import { usePrevious } from '../hooks/usePrevious';
import { Theme } from 'src/common/Theme';
import { getOutputStream } from 'src/registry';
import styled from 'styled-components';
import { Subject } from 'rxjs';

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
    if (
      route.auth !== 'any' &&
      ((route.auth && !isLogged) || (!route.auth && isLogged))
    ) {
      return false;
    }
    return matchesRoute(route.path, loc.pathname);
  });
}

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
`;

export const RouteResolver = () => {
  const { user, location, prevLocation } = useMappedState(
    [getGlobalState, getRouterState],
    (global, router) => ({
      ...R.pick(global, ['isLoaded', 'user']),
      ...R.pick(router, ['location', 'prevLocation']),
    })
  );
  const [loadingBarProgress, setLoadingBarProgress] = React.useState(0);
  const { replace } = useActions(RouterActions);
  const [component1, setComponent1] = useState<JSX.Element | null>(null);
  const [component2, setComponent2] = useState<JSX.Element | null>(null);
  const [currentComponent, setCurrentComponent] = useState(1);
  const loadIdRef = React.useRef(1);

  const setNextComponent = (comp: any) => {
    if (currentComponent === 1) {
      setComponent2(comp);
    } else {
      setComponent1(comp);
    }
  };

  const showNextComponent = () => {
    if (currentComponent === 1) {
      setComponent1(null);
      setCurrentComponent(2);
    } else {
      setComponent2(null);
      setCurrentComponent(1);
    }
  };

  const setComponent = (comp: JSX.Element) => {
    setComponent1(comp);
    setComponent2(null);
    setCurrentComponent(1);
  };

  const loaderRef = React.useRef(null as any);

  const prevUser = usePrevious(user);

  const load = (routeConfig: RouteConfig) => {
    const id = ++loadIdRef.current;
    let isStarted = false;
    const startTimeout = setTimeout(() => {
      isStarted = true;
      if (!routeConfig.noLoader) {
        loaderRef.current?.continuousStart();
      }
    }, 5);
    routeConfig.component().then(Component => {
      if (routeConfig.waitForAction && prevLocation && !getIsHmr()) {
        const comp = <Component />;
        setNextComponent(comp);
        return getOutputStream()
          .pipe(
            Rx.ofType(routeConfig.waitForAction),
            Rx.tap(() => {
              if (loadIdRef.current === id) {
                showNextComponent();
                loaderRef.current?.complete();
              }
            })
          )
          .toPromise();
      } else {
        clearTimeout(startTimeout);
        if (!routeConfig.noLoader && isStarted) {
          loaderRef.current?.complete();
        }
        setComponent(<Component />);
        return null;
      }
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
    replace(user ? '/' : '/login');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, user]);

  return (
    <>
      <LoaderWrapper>
        <LoadingBar
          ref={loaderRef}
          progress={loadingBarProgress}
          height={3}
          color={Theme.blue}
        />
      </LoaderWrapper>
      <div
        style={{
          height: '100%',
          display: currentComponent === 1 ? undefined : 'none',
        }}
      >
        {component1}
      </div>
      <div
        style={{
          height: '100%',
          display: currentComponent === 2 ? undefined : 'none',
        }}
      >
        {component2}
      </div>
    </>
  );
};
