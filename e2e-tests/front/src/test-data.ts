import { PagedResult, Challenge, AuthData } from 'shared';

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

export const authData1Verified: AuthData = {
  token: 'token1',
  user: {
    id: 'u1',
    email: '1@g.com',
    username: 'user1',
    isVerified: true,
  },
};
