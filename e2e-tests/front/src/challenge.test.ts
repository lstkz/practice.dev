import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { authData1Verified, getChallenges, solutions } from './test-data';

let engine: Engine = null!;

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
  engine.setMockedBundle('example challenge details');
  engine.setToken('t1');
});

it('should open a challenge', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@challenge-title').expect.toMatch('Challenge 1');
  await $('@challenge-details').expect.toMatch('example challenge details');
  await $('@challenge-stats @submissions').expect.toMatch('100');
  await $('@challenge-stats @solved').expect.toMatch('1');
  await $('@challenge-stats @solutions').expect.toMatch('4');
  await $('@no-solutions').expect.toMatch('No solutions yet.');
  await $('@create-solution-btn').expect.toBeHidden();
});

it('should display favorite solutions', async () => {
  engine.mock('solution_searchSolutions', (params, count) => {
    if (count === 1) {
      expect(params).toEqual<typeof params>({
        challengeId: 1,
        sortBy: 'likes',
        sortDesc: true,
        limit: 5,
      });
      return {
        cursor: null,
        items: solutions.slice(0, 5),
      };
    }
    return {
      cursor: null,
      items: [],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solution-s1').expect.toBeVisible();
  await $('@solution-s1 @title').expect.toMatch('Solution 1');
  await $('@solution-s1 @author').expect.toMatch('@user2');
  await $('@solution-s1 @like').expect.toMatch('10');
  await $('@solution-s1 @tag:nth-child(1)').expect.toMatch('react');
  await $('@solution-s1 @tag:nth-child(2)').expect.toMatch('sample2');
  await $('@solution-s5').expect.toBeVisible();
  await $('@solution-s5 @title').expect.toMatch('Solution 5');

  await $('@solution-s1 @title').click();
  await $('@solution-details-s1').expect.toBeVisible();
  expect(page.url()).toEqual(WEBSITE_URL + '/challenges/1?s=solution-1');
  await $('@solution-details-s1 @title').expect.toMatch('Solution 1');
  await $('@solution-details-s1 @author').expect.toMatch('@user2');
  await $('@solution-details-s1 @like').expect.toMatch('10');
  await $('@solution-details-s1 @url').expect.toMatch(
    'https://github.com/foo/bar'
  );
  await $('@solution-details-s1 @desc').expect.toMatch('Solution desc 1');
  await $('@solution-details-s1 @date').expect.toMatch('01.01.2000');
  await $('@solution-details-s1 @tag:nth-child(1)').expect.toMatch('react');
  await $('@solution-details-s1 @tag:nth-child(2)').expect.toMatch('sample2');
  await $('@solution-modal @close-btn').click();
  await $('@solution-details-s1').expect.toBeHidden();
  expect(page.url()).toEqual(WEBSITE_URL + '/challenges/1');
});
