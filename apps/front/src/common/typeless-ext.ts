import { Epic, AC, EpicResult, Deps } from 'typeless';
import { RouteConfig } from 'src/types';
import { RouterActions, getRouterState } from 'typeless-router';

type ExtractParams<T> = T extends RouteConfig<infer Params> ? Params : never;

interface OnRouteOptions<TRouteConfig extends RouteConfig> {
  $mounted: AC;
  routeConfig: TRouteConfig;
  onParamsChanged: (
    params: ExtractParams<TRouteConfig>,
    prevParams: ExtractParams<TRouteConfig> | null,
    deps: Deps
  ) => EpicResult;
}

declare module 'typeless/dist/Epic' {
  interface Epic {
    onRoute<TRouteConfig extends RouteConfig>(
      options: OnRouteOptions<TRouteConfig>
    ): this;
  }
}

const paramReg = /\:([a-zA-Z0-9_\-]+)/g;

function getRouteParams(currentPath: string | undefined, regPaths: RegExp[]) {
  if (!currentPath) {
    return null;
  }
  for (const regPath of regPaths) {
    const exec = regPath.exec(currentPath);
    if (exec) {
      const params: any = {};
      const groups = exec.groups || {};
      Object.keys(groups).forEach(key => {
        if (key.startsWith('n_')) {
          params[key.substr(2)] = Number(groups[key]);
        } else {
          params[key] = groups[key];
        }
      });
      return params;
    }
  }
  return null;
}

export function addTypelessExt() {
  Epic.prototype.onRoute = function (options) {
    const { $mounted, onParamsChanged, routeConfig } = options;
    const paths = Array.isArray(routeConfig.path)
      ? routeConfig.path
      : [routeConfig.path];
    const regPaths = paths.map(
      path => new RegExp(path.replace(paramReg, '(?<$1>[a-zA-Z0-9_\\-]+)'))
    );

    this.on(RouterActions.locationChange, (location, deps) => {
      const params = getRouteParams(location.pathname, regPaths);
      if (params) {
        const prev = getRouterState().prevLocation;
        const prevParams = getRouteParams(prev?.pathname, regPaths);
        return onParamsChanged(params, prevParams, deps);
      }
      return null;
    });

    this.on($mounted, (_, deps) => {
      const params = getRouteParams(
        getRouterState().location!.pathname,
        regPaths
      );
      return onParamsChanged(params, null, deps);
    });
    return this;
  };
}
