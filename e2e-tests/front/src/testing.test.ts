import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { authData1Verified, getChallenges } from './test-data';
import { MockSocket } from './lib/MockSocket';

let engine: Engine = null!;
const testId = 't1';

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.mock('challenge_getChallengeById', () => {
    const challenges = getChallenges(false);
    return challenges[0];
  });
  engine.mock('submission_searchSubmissions', () => {
    return {
      cursor: null,
      items: [],
    };
  });
  engine.mock('solution_searchSolutions', () => {
    return {
      cursor: null,
      items: [],
    };
  });
  engine.mock('challenge_submit', () => {
    return {
      id: testId,
    };
  });
  engine.setMockedBundle('example challenge details');
  engine.setToken('t1');
});

it('should handle an error if cannot connect to socket', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  const mockSocket = new MockSocket(page);
  await mockSocket.init();
  await $('@submit-btn').click();
  await $('@submit-modal @url-input').type('http://a.bb');
  await $('@submit-modal @submit-btn').click();
  await $('@submit-btn:disabled').expect.toBeVisible();
  await mockSocket.error('Some error');
  await $('@submit-error').expect.toMatch('Cannot connect to server');
  await $('@submit-btn:not(:disabled)').expect.toBeVisible();
});

it('should handle an error if there is an error after connect', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  const mockSocket = new MockSocket(page);
  await mockSocket.init();
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
          {
            id: 2,
            name: 'Test2',
            steps: [],
            result: 'pending',
          },
        ],
      },
      meta,
    },
  ]);
  await mockSocket.error('Some error');
  await $('@app-error').expect.toMatch(
    'An error occurred. Please refresh the page.'
  );
});

it('should handle an error if there is an error after connect', async () => {
  engine.mock('challenge_submit', () => {
    throw new MockError('Some error');
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  const mockSocket = new MockSocket(page);
  await mockSocket.init();
  await $('@submit-btn').click();
  await $('@submit-modal @url-input').type('http://a.bb');
  await $('@submit-modal @submit-btn').click();
  await mockSocket.open();
  await $('@submit-error').expect.toMatch('Some error');
  await $('@submit-btn:not(:disabled)').expect.toBeVisible();
});

it('should test the solution with PASS', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@submit-btn').expect.toBeHidden();
  const mockSocket = new MockSocket(page);
  await mockSocket.init();

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
          {
            id: 2,
            name: 'Test2',
            steps: [],
            result: 'pending',
          },
        ],
      },
      meta,
    },
  ]);
  await $('@submit-modal').expect.toBeHidden();
  await $('@recent-submissions @empty').expect.toMatch('N/A');

  await mockSocket.sendMessage({
    type: 'STARTING_TEST',
    payload: {
      testId: 1,
    },
    meta,
  });
  await $('@test-1 @loading').expect.toBeVisible();
  await mockSocket.sendMessage({
    type: 'STEP',
    payload: {
      testId: 1,
      text: 'Step 1.1',
      data: null,
    },
    meta,
  });
  await $('@test-1 @step-1').expect.toMatch('Step 1.1');
  await mockSocket.sendMessage({
    type: 'STEP',
    payload: {
      testId: 1,
      text: 'Step 1.2',
      data: null,
    },
    meta,
  });
  await $('@test-1 @step-2').expect.toMatch('Step 1.2');
  await mockSocket.sendMessage({
    type: 'TEST_PASS',
    payload: {
      testId: 1,
    },
    meta,
  });
  await $('@test-1 @loading').expect.toBeHidden();
  await $('@test-2 @loading').expect.toBeVisible();
  await mockSocket.sendMessage({
    type: 'STEP',
    payload: {
      testId: 2,
      text: 'Step 2.1',
      data: null,
    },
    meta,
  });
  await $('@test-2 @step-1').expect.toMatch('Step 2.1');

  await mockSocket.sendMessage([
    {
      type: 'TEST_PASS',
      payload: {
        testId: 2,
      },
      meta,
    },
    {
      type: 'RESULT',
      payload: {
        success: true,
      },
      meta,
    },
  ]);
  await $('@test-2 @loading').expect.toBeHidden();
  await $('@test-pass').expect.toMatch('PASS');
  await $('@submission-t1 @tag').expect.toMatch('PASS');
  await $('@submit-btn').expect.toBeVisible();
});

it('should test the solution with FAIL', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  const mockSocket = new MockSocket(page);
  await mockSocket.init();

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
          {
            id: 2,
            name: 'Test2',
            steps: [],
            result: 'pending',
          },
        ],
      },
      meta,
    },
  ]);
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
      text: 'Step 1.2',
      data: null,
    },
    meta,
  });
  await mockSocket.sendMessage([
    {
      type: 'TEST_FAIL',
      payload: {
        testId: 1,
        error: 'Some Error',
      },
      meta,
    },
    {
      type: 'RESULT',
      payload: {
        success: false,
      },
      meta,
    },
  ]);
  await $('@test-1 @loading').expect.toBeHidden();
  await $('@test-2 @loading').expect.toBeHidden();
  await $('@test-1 @test-error').expect.toMatch('Some Error');
  await $('@test-fail').expect.toMatch('FAIL');
  await $('@submission-t1 @tag').expect.toMatch('FAIL');
});
