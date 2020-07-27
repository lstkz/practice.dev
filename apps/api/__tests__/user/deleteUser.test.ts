import { resetDb, esReIndexFromDynamo } from '../helper';
import { _createUser } from '../../src/contracts/user/_createUser';
import { createSubmissionCUD } from '../../src/cud/submission';
import { SubmissionStatus } from 'shared';
import { createSolutionCUD } from '../../src/cud/solution';
import { createSolutionVoteCUD } from '../../src/cud/solutionVote';
import { deleteUser } from '../../src/contracts/user/deleteUser';
import {
  SubmissionEntity,
  SolutionEntity,
  SolutionVoteEntity,
  FeatureSubscriptionEntity,
  GithubUserEntity,
  ChallengeEntity,
  SolutionTagStatsEntity,
  UserEntity,
  UserUsernameEntity,
  UserEmailEntity,
} from '../../src/entities';
import { createFeatureSubscription } from '../../src/contracts/featureSubscription/createFeatureSubscription';
import { dynamodb } from '../../src/lib';
import { TABLE_NAME } from '../../src/config';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { esClearIndex } from '../../src/common/elastic';

beforeEach(async () => {
  await resetDb();
  await Promise.all([
    esClearIndex(SubmissionEntity.entityType),
    esClearIndex(SolutionEntity.entityType),
    esClearIndex(SolutionVoteEntity.entityType),
    esClearIndex(FeatureSubscriptionEntity.entityType),
    esClearIndex(GithubUserEntity.entityType),
  ]);
});

function _createChallenge() {
  return updateChallenge({
    id: 1,
    title: 'foo',
    description: 'foo',
    detailsBundleS3Key: 'http://example.org',
    testsBundleS3Key: 'http://example.org/tests',
    difficulty: 'easy',
    domain: 'frontend',
    tags: ['foo'],
    testCase: 'a',
  });
}

function _createUserById(id: number, githubId: number) {
  return _createUser({
    userId: `u${id}`,
    email: `user${id}@example.com`,
    username: 'user' + id,
    password: 'password1',
    isVerified: true,
    githubId: githubId,
  });
}

function _createSubmission(userId: string, id: number) {
  return createSubmissionCUD({
    submissionId: `s${id}`,
    userId: userId,
    createdAt: id,
    challengeId: 1,
    testUrl: 'https://example.org',
    status: SubmissionStatus.Queued,
    type: 'challenge',
  });
}

function _createSolution(userId: string, id: number) {
  return createSolutionCUD({
    solutionId: String(id),
    createdAt: id,
    title: 'solution',
    description: 'desc',
    slug: `s${id}`,
    url: 'https://github.com/repo',
    likes: 0,
    tags: ['a', 'b', 'c', 'd'],
    userId: userId,
    challengeId: 1,
  });
}

function _createVote(userId: string, solutionId: string) {
  return createSolutionVoteCUD({
    solutionId: solutionId,
    userId: userId,
    challengeId: 1,
    createdAt: 1,
  });
}

async function _getAllData() {
  const ret = await dynamodb
    .scan(
      {
        TableName: TABLE_NAME,
      },
      undefined
    )
    .promise();
  const ignore = [
    ChallengeEntity.entityType,
    SolutionTagStatsEntity.entityType,
  ];
  return ret.Items!.filter(x => !ignore.includes(x.entityType.S!));
}

async function _indexAll() {
  await Promise.all([
    esReIndexFromDynamo(SubmissionEntity.entityType),
    esReIndexFromDynamo(SolutionEntity.entityType),
    esReIndexFromDynamo(SolutionVoteEntity.entityType),
    esReIndexFromDynamo(FeatureSubscriptionEntity.entityType),
    esReIndexFromDynamo(GithubUserEntity.entityType),
  ]);
}

it('should remove user', async () => {
  const user1 = 'u1';
  await Promise.all([_createChallenge(), _createUserById(1, 10)]);
  await Promise.all([
    _createSubmission(user1, 1),
    _createSubmission(user1, 2),
    _createSolution(user1, 1),
    _createSolution(user1, 2),
  ]);
  await Promise.all([
    _createVote(user1, '1'),
    createFeatureSubscription('contest', `user1@example.com`),
  ]);
  await _indexAll();
  await deleteUser('user1');
  expect(await _getAllData()).toHaveLength(0);
});

it('should not remove other users data', async () => {
  const user1 = 'u1';
  const user2 = 'u2';
  const user3 = 'u3';
  await Promise.all([
    _createChallenge(),
    _createUserById(1, 10),
    _createUserById(2, 11),
    _createUserById(3, 12),
  ]);
  await Promise.all([
    _createSubmission(user2, 1),
    _createSubmission(user3, 2),
    _createSolution(user2, 1),
  ]);
  await Promise.all([
    _createVote(user3, '1'),
    createFeatureSubscription('contest', 'user5@example.com'),
  ]);
  await _indexAll();
  await deleteUser('user1');
  const data = await _getAllData();
  const getByType = (type: string) => data.filter(x => x.entityType.S === type);
  expect(getByType(UserEntity.entityType)).toHaveLength(2);
  expect(getByType(UserUsernameEntity.entityType)).toHaveLength(2);
  expect(getByType(UserEmailEntity.entityType)).toHaveLength(2);
  expect(getByType(GithubUserEntity.entityType)).toHaveLength(2);
  expect(getByType(SubmissionEntity.entityType)).toHaveLength(2);
  expect(getByType(SolutionEntity.entityType)).toHaveLength(1);
  expect(getByType(SolutionVoteEntity.entityType)).toHaveLength(1);
  expect(getByType(FeatureSubscriptionEntity.entityType)).toHaveLength(1);
});
