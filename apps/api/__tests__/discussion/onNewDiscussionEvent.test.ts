import { SES } from 'aws-sdk';
import { resetDb, esReIndexFromDynamo } from '../helper';
import { ses } from '../../src/lib';
import {
  registerSampleUsers,
  addSampleChallenges,
  addSampleProjects,
} from '../seed-data';
import { createComment } from '../../src/contracts/discussion/createComment';
import { unsubscribe } from '../../src/contracts/discussion/unsubscribe';
import { makeAdmin } from '../../src/contracts/user/makeAdmin';

let sentEmails: Array<{ to: string; title: string; msg: string }> = [];

beforeEach(async () => {
  await resetDb();
  await Promise.all([
    registerSampleUsers(),
    addSampleChallenges(),
    addSampleProjects(),
  ]);
  await esReIndexFromDynamo('User');
  sentEmails = [];

  const sendEmailMock: any = (params: SES.Types.SendEmailRequest) => ({
    promise: () => {
      sentEmails.push({
        to: params.Destination!.ToAddresses![0],
        title: params.Message.Subject.Data,
        msg: params.Message.Body.Html!.Data,
      });
      return Promise.resolve();
    },
  });
  jest.spyOn(ses, 'sendEmail').mockImplementation(sendEmailMock);
});

it('should notify user (challenge)', async () => {
  const comment = await createComment('1', {
    challengeId: 1,
    text: 'foo',
  });

  await createComment('2', {
    challengeId: 1,
    text: 'bar',
    parentCommentId: comment.id,
  });
  expect(sentEmails).toHaveLength(1);
  const { msg, title, to } = sentEmails[0];
  expect(to).toEqual('user1@example.com');
  expect(title).toEqual('New reply in "foo" by user2');
  expect(msg).toMatch('foo');
  expect(msg).toMatch('bar');
  expect(msg).toMatch('https://practice.dev/challenges/1?unsubscribe=');
  expect(msg).toMatch('<a href="https://practice.dev/challenges/1">foo</a>');
});

it('should notify user (project challenge)', async () => {
  const comment = await createComment('1', {
    challengeId: 1,
    projectId: 1,
    text: 'foo',
  });

  await createComment('2', {
    challengeId: 1,
    projectId: 1,
    text: 'bar',
    parentCommentId: comment.id,
  });
  expect(sentEmails).toHaveLength(1);
  const { msg, title, to } = sentEmails[0];
  expect(to).toEqual('user1@example.com');
  expect(title).toEqual('New reply in "foo1" by user2');
  expect(msg).toMatch('foo');
  expect(msg).toMatch('bar');
  expect(msg).toMatch(
    'https://practice.dev/projects/1/challenges/1?unsubscribe='
  );
  expect(msg).toMatch(
    '<a href="https://practice.dev/projects/1/challenges/1">foo1</a>'
  );
});

it('should not notify the author when he replies', async () => {
  const comment = await createComment('1', {
    challengeId: 1,
    text: 'foo',
  });

  await createComment('1', {
    challengeId: 1,
    text: 'bar',
    parentCommentId: comment.id,
  });
  expect(sentEmails).toHaveLength(0);
});

it('should unsubscribe and do not receive more emails', async () => {
  const comment = await createComment('1', {
    challengeId: 1,
    text: 'foo',
  });

  await createComment('2', {
    challengeId: 1,
    text: 'bar',
    parentCommentId: comment.id,
  });
  expect(sentEmails).toHaveLength(1);
  const exec = /unsubscribe=(.+?)"/.exec(sentEmails[0].msg);
  expect(exec).toBeDefined();
  await unsubscribe('1', exec![1]);
  sentEmails = [];
  await createComment('2', {
    challengeId: 1,
    text: 'bar2',
    parentCommentId: comment.id,
  });
  expect(sentEmails).toHaveLength(0);
});

describe('admin', () => {
  beforeEach(async () => {
    await makeAdmin('1');
    await esReIndexFromDynamo('User');
  });

  it('admin should receive an email on new question', async () => {
    const comment = await createComment('2', {
      challengeId: 1,
      text: 'foo',
    });

    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0].to).toEqual('user1@example.com');
    expect(sentEmails[0].title).toEqual('New question in "foo" by user2');
    expect(sentEmails[0].msg).toMatch('foo');
    sentEmails.pop();
    await createComment('2', {
      challengeId: 1,
      text: 'bar',
      parentCommentId: comment.id,
    });
    expect(sentEmails[0].to).toEqual('user1@example.com');
    expect(sentEmails[0].title).toEqual('New reply in "foo" by user2');
    expect(sentEmails[0].msg).toMatch('foo');
    expect(sentEmails[0].msg).toMatch('bar');
  });

  it('admin should not receive an email when he comments', async () => {
    const comment = await createComment('1', {
      challengeId: 1,
      text: 'foo',
    });
    await createComment('1', {
      challengeId: 1,
      text: 'bar',
      parentCommentId: comment.id,
    });

    expect(sentEmails).toHaveLength(0);
  });
});
