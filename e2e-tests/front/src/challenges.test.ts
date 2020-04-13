import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { emptyChallenges, authData1Verified, getChallenges } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.mock('challenge_getChallengeTags', () => {
    return [
      { count: 1, name: 'tag1' },
      { count: 33, name: 'tag2' },
    ];
  });
  engine.setToken('t1');
});

it('should display empty challenges', async () => {
  engine.mock('challenge_searchChallenges', () => emptyChallenges);
  await page.goto(WEBSITE_URL);
  await $('@no-challenges').expect.toMatch('No Challenges');
});

it('should display challenges as logged in', async () => {
  engine.mock('challenge_searchChallenges', () => {
    const challenges = getChallenges(true);
    return {
      items: challenges.slice(0, 10),
      pageNumber: 0,
      pageSize: 10,
      total: challenges.length,
      totalPages: Math.ceil(challenges.length / 10),
    };
  });
  await page.goto(WEBSITE_URL);
  await $('@challenge_1 @title').expect.toMatch('Challenge 1');
  await $('@challenge_1 @desc').expect.toMatch('Desc 1');
  await $('@challenge_1 @submissions').expect.toMatch('100');
  await $('@challenge_1 @solved').expect.toMatch('1');
  await $('@challenge_1 @solve-btn').expect.toMatchAttr(
    'href',
    '/challenges/1'
  );
  await $('@challenge_1 @tag-domain').expect.toMatch('frontend');
  await $('@challenge_1 @tag-difficulty').expect.toMatch('medium');
  await $('@challenge_1 @tag-custom').expect.toMatch('tag1');
  await $('@challenge_1 @solved-tag').expect.toBeVisible();
  await $('@challenge_2 @solved-tag').expect.toBeHidden();
});

it('should display challenges as not logged in', async () => {
  engine.setToken(null);
  engine.mock('challenge_searchChallenges', () => {
    const challenges = getChallenges(false);
    return {
      items: challenges.slice(0, 10),
      pageNumber: 0,
      pageSize: 10,
      total: challenges.length,
      totalPages: Math.ceil(challenges.length / 10),
    };
  });
  await page.goto(WEBSITE_URL + '/challenges');
  await $('@challenge_1 @title').expect.toMatch('Challenge 1');
  await $('@challenge_1 @desc').expect.toMatch('Desc 1');
  await $('@challenge_1 @submissions').expect.toMatch('100');
  await $('@challenge_1 @solved').expect.toMatch('1');
  await $('@challenge_1 @solve-btn').expect.toMatchAttr(
    'href',
    '/challenges/1'
  );
  await $('@challenge_1 @tag-domain').expect.toMatch('frontend');
  await $('@challenge_1 @tag-difficulty').expect.toMatch('medium');
  await $('@challenge_1 @tag-custom').expect.toMatch('tag1');
  await $('@challenge_1 @solved-tag').expect.toBeHidden();
});

it('should load more challenges', async () => {
  // TODO
});

it("should display error if challenges can't be loaded", async () => {
  engine.mock('challenge_searchChallenges', () => {
    throw new MockError('API not working');
  });
  await page.goto(WEBSITE_URL);
  await $('@app-error').expect.toMatch('API not working');
});

it('should not display solved/unsolved filter if not logged in', async () => {
  engine.setToken(null);
  engine.mock('challenge_searchChallenges', () => {
    return emptyChallenges;
  });
  await page.goto(WEBSITE_URL + '/challenges');
  await $('@filter-difficulty').expect.toBeVisible();
  await $('@filter-challenges').expect.toBeHidden();
});

it('filter properly (by solved status)', async () => {
  let resolve: any = null;
  let promise = new Promise(r => {
    resolve = r;
  });
  engine.mock('challenge_searchChallenges', (params, count) => {
    // initial
    if (count === 1) {
      expect(params).toEqual<typeof params>({
        difficulties: [],
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: [],
        tags: [],
      });
    }
    // check "solved"
    if (count === 2) {
      expect(params).toEqual<typeof params>({
        difficulties: [],
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: ['solved'],
        tags: [],
      });
    }
    // check "unsolved", reload
    if (count === 3 || count === 4) {
      expect(params).toEqual<typeof params>({
        difficulties: [],
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: ['solved', 'unsolved'],
        tags: [],
      });
    }
    // go back
    if (count === 5) {
      expect(params).toEqual<typeof params>({
        difficulties: [],
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: ['solved'],
        tags: [],
      });
    }
    if (count === 5) {
      resolve();
    }
    return emptyChallenges;
  });
  await page.goto(WEBSITE_URL + '/challenges');
  await $('@filter-challenges @option-solved').click();
  await $('@filter-challenges @option-unsolved').click();
  await page.reload();
  await $(
    '@filter-challenges @option-solved input:checked'
  ).expect.toBeVisible();
  await $(
    '@filter-challenges @option-unsolved input:checked'
  ).expect.toBeVisible();
  await page.goBack();
  await $(
    '@filter-challenges @option-solved input:checked'
  ).expect.toBeVisible();
  await $(
    '@filter-challenges @option-unsolved input:not(:checked)'
  ).expect.toBeVisible();
  await promise;
});

it('filter with custom url', async () => {
  engine.mock('challenge_searchChallenges', (params, count) => {
    expect(params).toEqual<typeof params>({
      difficulties: ['hard', 'medium'],
      domains: ['backend'],
      sortBy: 'created',
      sortOrder: 'desc',
      statuses: ['solved'],
      tags: ['tag1', 'tag2'],
    });
    return emptyChallenges;
  });

  await page.goto(
    WEBSITE_URL +
      '/challenges?status=solved&difficulty=hard,medium&domain=backend&tags=tag1,tag2&sortOrder=newest'
  );
  const expectIsChecked = (input: string) =>
    $(`${input} input:checked`).expect.toBeVisible();
  const expectIsNotChecked = (input: string) =>
    $(`${input} input:not(:checked)`).expect.toBeVisible();
  // challenges
  await expectIsChecked('@filter-challenges @option-solved');
  await expectIsNotChecked('@filter-challenges @option-unsolved');
  // difficulty
  await expectIsNotChecked('@filter-difficulty @option-easy');
  await expectIsChecked('@filter-difficulty @option-medium');
  await expectIsChecked('@filter-difficulty @option-hard');
  // domain
  await expectIsNotChecked('@filter-domain @option-frontend');
  await expectIsChecked('@filter-domain @option-backend');
  await expectIsNotChecked('@filter-domain @option-fullstack');
  // tags
  await $(
    '@filter-tags .react-select__multi-value:nth-child(1)'
  ).expect.toMatch('tag1');
  await $(
    '@filter-tags .react-select__multi-value:nth-child(2)'
  ).expect.toMatch('tag2');
  // sort
  await $('@filter-sort .react-select__single-value').expect.toMatch('Newest');
});
