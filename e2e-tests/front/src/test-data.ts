import { PagedResult, Challenge, AuthData } from 'shared';
import { getRange } from './helper';

export const emptyChallenges: PagedResult<Challenge> = {
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
      detailsBundleS3Key: 'key',
      domain: mod4 === 0 ? 'backend' : mod4 === 1 ? 'frontend' : 'fullstack',
      isSolved: loggedIn && id % 2 === 1,
      tags: ['tag' + mod3],
      stats: {
        likes: 10,
        solutions: 4,
        solved: 1,
        submissions: 100,
      },
      testCase: 'test-case',
    } as Challenge;
  });
