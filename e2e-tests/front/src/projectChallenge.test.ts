import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import {
  authData1Verified,
  authData1,
  getProjectChallenges,
} from './test-data';
import { MockSocket } from './lib/MockSocket';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.mock('project_getProjectChallenge', () => {
    const challenges = getProjectChallenges(false);
    return challenges[0];
  });
  engine.mock('submission_searchSubmissions', () => {
    return {
      cursor: null,
      items: [],
    };
  });
  engine.setMockedBundle('example challenge details');
  engine.setToken('t1');
});

it('should open a challenge', async () => {
  await page.goto(WEBSITE_URL + '/projects/1/challenges/1');
  await $('@challenge-title').expect.toMatch('Challenge 1');
  await $('@challenge-details').expect.toMatch('example challenge details');
  await $('@challenge-stats @submissions').expect.toMatch('100');
  await $('@challenge-stats @solved').expect.toMatch('1');
});

it('should open error popup if submitting as unverified', async () => {
  engine.mock('user_getMe', () => {
    return authData1.user;
  });
  await page.goto(WEBSITE_URL + '/projects/1/challenges/1');
  await $('@submit-btn').click();
  await $('@error-modal').expect.toBeVisible();
  await $('@error-msg').expect.toMatch(
    'You must verify email to perform this action.'
  );
});

it('should submit successfully', async () => {
  const testId = 't1';
  engine.mock('challenge_submit', values => {
    expect(values).toEqual<typeof values>({
      challengeId: 1,
      projectId: 1,
      testUrl: 'http://a.bb',
    });
    return {
      id: testId,
    };
  });
  await page.goto(WEBSITE_URL + '/projects/1/challenges/1');
  const mockSocket = new MockSocket(page);
  await mockSocket.init();
  await $('@submit-btn').expect.toBeVisible();
  await $('@next-challenge-btn').expect.toBeHidden();
  await $('@submit-btn').click();
  await $('@submit-modal @url-input').type('http://a.bb');
  await $('@submit-modal @submit-btn').click();
  await mockSocket.open();
  await page.waitFor(10);
  const meta = { id: testId };
  await mockSocket.sendMessage([
    {
      type: 'TEST_INFO',
      payload: {
        tests: [
          {
            id: 1,
            name: 'Test1',
            steps: [],
            result: 'pending',
          },
        ],
      },
      meta,
    },
  ]);
  await $('@submit-modal').expect.toBeHidden();
  await mockSocket.sendMessage({
    type: 'STARTING_TEST',
    payload: {
      testId: 1,
    },
    meta,
  });
  await mockSocket.sendMessage({
    type: 'STEP',
    payload: {
      testId: 1,
      text: 'Step 1.1',
      data: null,
    },
    meta,
  });
  await mockSocket.sendMessage({
    type: 'TEST_PASS',
    payload: {
      testId: 1,
    },
    meta,
  });
  await mockSocket.sendMessage({
    type: 'RESULT',
    payload: {
      success: true,
    },
    meta,
  });
  await $('@test-pass').expect.toMatch('PASS');
});

it('should add a new comment', async () => {
  const baseComment = {
    challengeId: 1,
    projectId: 1,
    createdAt: new Date(2000, 1, 1).toISOString(),
    children: [],
    isAnswer: false,
    isAnswered: false,
    isDeleted: false,
    text: 'com1',
    user: {
      id: authData1.user.id,
      username: authData1.user.username,
    },
  };
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [],
    };
  });
  engine.mock('discussion_createComment', (params, count) => {
    expect(params).toEqual<typeof params>({
      challengeId: 1,
      projectId: 1,
      text: 'foo',
    });
    if (count === 1) {
      throw new MockError('Err');
    }
    return {
      ...baseComment,
      text: 'foo',
      id: '1',
    };
  });
  await page.goto(WEBSITE_URL + '/projects/1/challenges/1');
  await $('@discussion-tab').click();
  await $('@new-comment-input').type('foo');
  await $('@post-comment-btn').click();
  await $('@add-comment-error').expect.toMatch('Err');
  await $('@post-comment-btn').click();
  await $('@new-comment-input').expect.toMatch('');
  await $('@comment-1').expect.toBeVisible();
  await $('@comment-1 @text').expect.toMatch('foo');
  await $('@add-comment-error').expect.toBeHidden();
});
