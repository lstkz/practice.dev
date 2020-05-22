import {
  PagedResult,
  Challenge,
  AuthData,
  TestInfo,
  Solution,
  Project,
} from 'shared';
import { getRange } from './helper';

export const emptyChallenges: PagedResult<Challenge> = {
  items: [],
  pageNumber: 0,
  pageSize: 0,
  total: 0,
  totalPages: 0,
};

export const emptyProjects: PagedResult<Project> = {
  items: [],
  pageNumber: 0,
  pageSize: 0,
  total: 0,
  totalPages: 0,
};

export const authData1: AuthData = {
  token: 'token1',
  user: {
    id: 'u1',
    email: '1@g.com',
    username: 'user1',
    isVerified: false,
  },
};
export const authData2: AuthData = {
  token: 'token2',
  user: {
    id: 'u2',
    email: '2@g.com',
    username: 'user2',
    isVerified: false,
  },
};

export const authData1Verified: AuthData = {
  token: 'token1',
  user: {
    ...authData1.user,
    isVerified: true,
  },
};

export const authData2Verified: AuthData = {
  token: 'token2',
  user: {
    ...authData2.user,
    isVerified: true,
  },
};

export const getChallenges = (loggedIn: boolean) =>
  getRange(20).map(id => {
    const mod3 = id % 3;
    const mod4 = id % 4;
    return {
      id,
      createdAt: new Date(2000, 0, id).toISOString(),
      title: 'Challenge ' + id,
      description: 'Desc ' + id,
      difficulty: mod3 === 0 ? 'easy' : mod3 === 1 ? 'medium' : 'hard',
      detailsBundleS3Key: `bundle.js`,
      domain: mod4 === 0 ? 'backend' : mod4 === 1 ? 'frontend' : 'fullstack',
      isSolved: loggedIn && id % 2 === 1,
      tags: ['tag' + mod3],
      stats: {
        likes: 10,
        solutions: 4,
        solved: 1,
        submissions: 100,
      },
      testCase: JSON.stringify([
        {
          id: 1,
          name: 'Navigate to page',
          steps: [],
        },
        {
          id: 2,
          name: 'Click on button',
          steps: [],
        },
        {
          id: 3,
          name: 'Enter text',
          steps: [],
        },
      ] as TestInfo[]),
    } as Challenge;
  });

export const solutions: Solution[] = getRange(20).map(id => {
  return {
    id: `s${id}`,
    title: `Solution ${id}`,
    tags: ['react', `sample${(id % 3) + 1}`],
    description: `Solution desc ${id}`,
    isLiked: false,
    likes: 10,
    slug: `solution-${id}`,
    challengeId: 1,
    createdAt: new Date(2000, 0, 1).toISOString(),
    url: 'https://github.com/foo/bar',
    user: {
      id: `u${(id % 2) + 1}`,
      username: `user${(id % 2) + 1}`,
    },
  };
});

export const getProjects = (loggedIn: boolean) =>
  getRange(20).map(id => {
    const mod3 = id % 3;
    const mod4 = id % 4;
    return {
      id,
      createdAt: new Date(2000, 0, id).toISOString(),
      title: 'Project ' + id,
      description: 'Desc ' + id,
      domain: mod4 === 0 ? 'backend' : mod4 === 1 ? 'frontend' : 'fullstack',
      solvedPercent: loggedIn ? (mod3 === 1 ? 50 : mod3 === 2 ? 100 : 0) : 0,
      stats:
        mod3 === 1
          ? {
              solved_1: 10,
              solved_2: 20,
              submissions_1: 20,
              submissions_2: 30,
            }
          : {},
    } as Project;
  });
