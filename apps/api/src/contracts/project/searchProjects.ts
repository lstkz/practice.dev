import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { ProjectEntity, ProjectChallengeSolvedEntity } from '../../entities';
import { Project, PagedResult } from 'shared';

function _getProjectStats(project: Project, name: 'solved' | 'submissions') {
  let ret = 0;
  Object.keys(project.stats).forEach(key => {
    if (key.startsWith(name)) {
      ret += project.stats[key];
    }
  });
  return ret;
}

export const searchProjects = createContract('project.searchProjects')
  .params('userId', 'criteria')
  .schema({
    userId: S.string(),
    criteria: S.object().keys({
      sortBy: S.enum().literal('created', 'solved', 'submissions').optional(),
      sortOrder: S.enum().literal('desc', 'asc').optional(),
      pageSize: S.pageSize(),
      pageNumber: S.pageNumber(),
      domains: S.array().items(S.string()).optional(),
      statuses: S.array()
        .items(S.enum().literal('solved', 'partial', 'unsolved'))
        .optional(),
    }),
  })
  .fn(async (userId, criteria) => {
    const { sortBy, sortOrder, domains, statuses } = criteria;
    const pageSize = criteria.pageSize!;
    const pageNumber = criteria.pageNumber!;
    const [items, solved] = await Promise.all([
      ProjectEntity.getAll(),
      ProjectChallengeSolvedEntity.getAllByUserId(userId),
    ]);
    const maxSolved: Record<string, number> = {};
    solved.forEach(item => {
      const max = maxSolved[item.projectId] ?? 0;
      if (max < item.challengeId) {
        maxSolved[item.projectId] = item.challengeId;
      }
    });

    const allProjects = R.pipe(
      items,
      R.map(item => {
        return item.toProject(
          ((maxSolved[item.projectId] ?? 0) / item.challengeCount) * 100
        );
      }),
      R.filter(item => {
        if (domains && domains.length) {
          if (!domains.includes(item.domain)) {
            return false;
          }
        }
        if (statuses && statuses.length) {
          if (
            item.solvedPercent === 100 &&
            !statuses.some(x => x === 'solved')
          ) {
            return false;
          }
          if (
            item.solvedPercent === 0 &&
            !statuses.some(x => x === 'unsolved')
          ) {
            return false;
          }
          if (
            item.solvedPercent > 0 &&
            item.solvedPercent < 100 &&
            !statuses.some(x => x === 'partial')
          ) {
            return false;
          }
        }
        return true;
      }),
      R.sort((a, b) => {
        const mul = sortOrder === 'desc' ? -1 : 1;
        if (sortBy && sortBy !== 'created') {
          const diff =
            mul * (_getProjectStats(a, sortBy) - _getProjectStats(b, sortBy));
          if (diff === 0) {
            return a.id - b.id;
          }
          return diff;
        }
        return mul * (a.id - b.id);
      })
    );
    const start = pageNumber * pageSize;
    const paginated = allProjects.slice(start, start + pageSize);

    const total = allProjects.length;
    const result: PagedResult<Project> = {
      total,
      pageSize,
      pageNumber,
      totalPages: Math.ceil(total / pageSize),
      items: paginated,
    };
    return result;
  });

export const searchProjectsRpc = createRpcBinding({
  injectUser: true,
  signature: 'project.searchProjects',
  handler: searchProjects,
});
