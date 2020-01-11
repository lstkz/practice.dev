import { _createUser } from '../src/contracts/user/_createUser';
import { createToken } from '../src/contracts/user/createToken';
import { updateChallenge } from '../src/contracts/challenge/updateChallenge';

export async function registerSampleUsers() {
  await Promise.all([
    _createUser({
      userId: '1',
      email: 'user1@example.com',
      username: 'user1',
      password: 'password1',
      isVerified: true,
    }).then(() => createToken('1', 'user1_token')),
    _createUser({
      userId: '2',
      email: 'user2@example.com',
      username: 'user2',
      password: 'password2',
      isVerified: true,
    }).then(() => createToken('2', 'user2_token')),
  ]);
}

export async function addSampleTasks() {
  await Promise.all([
    updateChallenge({
      id: 1,
      title: 'foo',
      description: 'foo',
      bundle: 'http://example.org',
      tests: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'frontend',
      tags: ['foo'],
    }),
    updateChallenge({
      id: 2,
      title: 'bar',
      description: 'bar',
      bundle: 'http://example.org',
      tests: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'backend',
      tags: ['foo'],
    }),
    updateChallenge({
      id: 3,
      title: 'abc',
      description: 'abc',
      bundle: 'http://example.org',
      tests: 'http://example.org/tests',
      difficulty: 'easy',
      domain: 'backend',
      tags: ['foo'],
    }),
  ]);
}
