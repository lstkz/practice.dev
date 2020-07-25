import React, { useState } from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { useActions, useMappedState, getIsHmr } from 'typeless';
import { getRouterState, RouterActions, RouterLocation } from 'typeless-router';
import LoadingBar from 'react-top-loading-bar';
import { RouteConfig } from '../types';
import { getGlobalState, GlobalActions } from '../features/global/interface';
import { usePrevious } from '../hooks/usePrevious';
import { Theme } from 'src/Theme';
import { getOutputStream } from 'src/registry';
import styled from 'styled-components';
import { globalLoader } from 'src/common/globalLoader';

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
  z-index: 20000;
`;

export const RouteResolver = () => {
  const { user, location, prevLocation } = useMappedState(
    [getGlobalState, getRouterState],
    (global, router) => ({
      ...R.pick(global, ['isLoaded', 'user']),
      ...R.pick(router, ['location', 'prevLocation']),
    })
  );
  const { replace } = useActions(RouterActions);
  const { showAppError } = useActions(GlobalActions);
  const [component1, setComponent1] = useState<JSX.Element | null>(null);
  const [component2, setComponent2] = useState<JSX.Element | null>(null);
  const [currentComponent, setCurrentComponent] = useState(1);
  const loadIdRef = React.useRef(1);
  const loadingStarted = React.useRef(false);

  React.useEffect(() => {
    globalLoader.start = () => {
      loaderRef.current?.continuousStart();
      loadingStarted.current = true;
    };
    globalLoader.complete = () => {
      loaderRef.current?.complete();
      loadingStarted.current = false;
    };
  }, []);

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

  const getCurrentComponent = () => {
    if (currentComponent === 1) {
      return component1;
    } else {
      return component2;
    }
  };

  const loaderRef = React.useRef(null as any);

  const prevUser = usePrevious(user);

  const load = (routeConfig: RouteConfig) => {
    const id = ++loadIdRef.current;
    setNextComponent(null);
    const isCancelled = () => {
      const ret = id !== loadIdRef.current;
      return ret;
    };
    const startTimeout = setTimeout(() => {
      if (isCancelled()) {
        return;
      }
      if (!routeConfig.noLoader && !loadingStarted.current) {
        globalLoader.start();
      }
    }, 500);
    const tryCompleteLoader = () => {
      if (isCancelled()) {
        return;
      }
      clearTimeout(startTimeout);
      if (!routeConfig.noLoader && loadingStarted.current) {
        globalLoader.complete();
      }
    };
    const scrollTop = () => {
      try {
        document.querySelector('html')!.scrollTo(0, 0);
      } catch (e) {
        console.error(e);
      }
    };
    routeConfig
      .component()
      .then(Component => {
        if (isCancelled()) {
          return;
        }
        const isSame = getCurrentComponent()?.type === Component;
        if (isSame && !getIsHmr()) {
          tryCompleteLoader();
          return;
        }
        if (
          !isSame &&
          routeConfig.waitForAction &&
          prevLocation &&
          !getIsHmr()
        ) {
          const comp = <Component />;
          setNextComponent(comp);
          return getOutputStream()
            .pipe(
              Rx.ofType([
                routeConfig.waitForAction,
                GlobalActions.showAppError,
              ]),
              Rx.take(1),
              Rx.tap(() => {
                if (isCancelled()) {
                  return;
                }
                showNextComponent();
                tryCompleteLoader();
                scrollTop();
              })
            )
            .toPromise();
        } else {
          tryCompleteLoader();
          setComponent(<Component />);
          scrollTop();
          return null;
        }
      })
      .catch(() => {
        if (isCancelled()) {
          return;
        }
        tryCompleteLoader();
        showAppError('No internet connection. Please refresh the page.');
      });
  };

  React.useLayoutEffect(() => {
    let match = getMatch(location, !!user);
    if (match) {
      load(match);
      return;
    }
    if (!prevUser && user && prevLocation) {
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
    replace(user ? '/challenges' : '/login');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, user]);
  return (
    <>
      <LoaderWrapper>
        <LoadingBar
          ref={loaderRef}
          progress={0}
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
