import { getGlobalSolutionsState } from './interface';
import React from 'react';

export function useSolutions(ids: string[]) {
  const { solutionMap } = getGlobalSolutionsState.useState();
  return React.useMemo(() => {
    return ids.map(id => solutionMap[id]);
  }, [solutionMap, ids]);
}

export function useSolution(id: string) {
  const { solutionMap } = getGlobalSolutionsState.useState();
  return solutionMap[id]!;
}

export function useSolutionOrNull(id: string) {
  const { solutionMap } = getGlobalSolutionsState.useState();
  return solutionMap[id] ? solutionMap[id] : null;
}
