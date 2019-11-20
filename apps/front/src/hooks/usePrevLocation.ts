import { getRouterState } from 'typeless-router';

export function usePrevLocation(href: string) {
  const { prevLocation } = getRouterState.useState();
  const getSearch = () => {
    if (!prevLocation) {
      return '';
    }
    if (!prevLocation.search) {
      return '';
    }
    if (prevLocation.search[0] === '?') {
      return prevLocation.search;
    }
    return '?' + prevLocation.search;
  };
  return prevLocation ? prevLocation.pathname + getSearch() : href;
}
