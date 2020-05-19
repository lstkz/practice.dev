import { _createUser } from '../src/contracts/user/_createUser';
import { createToken } from '../src/contracts/user/createToken';
import { updateChallenge } from '../src/contracts/challenge/updateChallenge';
import { updateProject } from '../src/contracts/project/updateProject';

export async function registerSampleUsers(isVerified = true) {
  await Promise.all([
    _createUser({
      userId: '1',
      email: 'user1@example.com',
      username: 'user1',
      password: 'password1',
      isVerified: isVerified,
    }).then(() => createToken('1', 'user1_token')),
    _createUser({
      userId: '2',
      email: 'user2@example.com',
      username: 'user2',
      password: 'password2',
      isVerified: isVerified,
    }).then(() => createToken('2', 'user2_token')),
  ]);
}

export async function addSampleChallenges() {
  await Promise.all([
    updateChallenge({
      id: 1,
      title: 'foo',
      description: 'foo',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'frontend',
      tags: ['foo'],
      testCase: 'a',
    }),
    updateChallenge({
      id: 2,
      title: 'bar',
      description: 'bar',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'backend',
      tags: ['foo'],
      testCase: 'a',
    }),
    updateChallenge({
      id: 3,
      title: 'abc',
      description: 'abc',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'backend',
      tags: ['foo'],
      testCase: 'a',
    }),
  ]);
}

export async function addSampleProjects() {
  await Promise.all([
    updateProject(
      {
        id: 1,
        title: 'foo',
        description: 'foo',
        domain: 'frontend',
      },
      [
        {
          id: 1,
          title: 'foo1',
          description: 'foo1',
          detailsBundleS3Key: 'http://example.org',
          testsBundleS3Key: 'http://example.org/tests',
          testCase: 'a',
        },
        {
          id: 2,
          title: 'foo2',
          description: 'foo2',
          detailsBundleS3Key: 'http://example.org',
          testsBundleS3Key: 'http://example.org/tests',
          testCase: 'a',
        },
        {
          id: 3,
          title: 'foo3',
          description: 'foo3',
          detailsBundleS3Key: 'http://example.org',
          testsBundleS3Key: 'http://example.org/tests',
          testCase: 'a',
        },
      ]
    ),
    updateProject(
      {
        id: 2,
        title: 'bar',
        description: 'bar',
        domain: 'backend',
      },
      [
        {
          id: 1,
          title: 'bar1',
          description: 'bar1',
          detailsBundleS3Key: 'http://example.org',
          testsBundleS3Key: 'http://example.org/tests',
          testCase: 'a',
        },
        {
          id: 2,
          title: 'bar',
          description: 'bar',
          detailsBundleS3Key: 'http://example.org',
          testsBundleS3Key: 'http://example.org/tests',
          testCase: 'a',
        },
      ]
    ),
    updateProject(
      {
        id: 3,
        title: 'baz',
        description: 'baz',
        domain: 'fullstack',
      },
      [
        {
          id: 1,
          title: 'baz1',
          description: 'baz1',
          detailsBundleS3Key: 'http://example.org',
          testsBundleS3Key: 'http://example.org/tests',
          testCase: 'a',
        },
      ]
    ),
  ]);
}
