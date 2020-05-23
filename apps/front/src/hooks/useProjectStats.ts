import { Project, getProjectStats } from 'shared';
import React from 'react';

export function useProjectStats(project: Project) {
  return React.useMemo(() => {
    return {
      solved: getProjectStats(project, 'solved'),
      submissions: getProjectStats(project, 'submissions'),
    };
  }, [project]);
}
