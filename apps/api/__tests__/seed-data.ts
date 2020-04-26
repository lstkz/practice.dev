import { _createUser } from '../src/contracts/user/_createUser';
import { createToken } from '../src/contracts/user/createToken';
import {
  ChallengeCollection,
  ChallengeModel,
} from '../src/collections/Challenge';

export async function registerSampleUsers() {
  await Promise.all([
    _createUser({
      email: 'user1@example.com',
      username: 'user1',
      password: 'password1',
      isVerified: true,
    }).then(() => createToken(1, 'user1_token')),
    _createUser({
      email: 'user2@example.com',
      username: 'user2',
      password: 'password2',
      isVerified: true,
    }).then(() => createToken(2, 'user2_token')),
  ]);
}

export async function addSampleChallenges() {
  const challenges: ChallengeModel[] = [
    {
      _id: 1,
      createdAt: 1,
      title: 'foo',
      description: 'foo',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'frontend',
      tags: ['foo'],
      testCase: 'a',
      stats: {
        submissions: 0,
        solved: 0,
        solutions: 0,
        likes: 0,
      },
    },
    {
      _id: 2,
      createdAt: 2,
      title: 'bar',
      description: 'bar',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'backend',
      tags: ['foo'],
      testCase: 'a',
      stats: {
        submissions: 0,
        solved: 0,
        solutions: 0,
        likes: 0,
      },
    },
    {
      _id: 3,
      createdAt: 3,
      title: 'abc',
      description: 'abc',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'backend',
      tags: ['foo'],
      testCase: 'a',
      stats: {
        submissions: 0,
        solved: 0,
        solutions: 0,
        likes: 0,
      },
    },
  ];
  await ChallengeCollection.insertMany(challenges);
}
