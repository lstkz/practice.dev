import { WEBSITE_URL } from './config';
import { Engine } from './lib/Engine';
import {
  authData1Verified,
  getChallenges,
  solutions,
  authData1,
} from './test-data';

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
  engine.mock('solutionTags_searchSolutionTags', () => {
    return {
      cursor: null,
      items: [
        {
          name: 'react',
          count: 10,
        },
        {
          name: 'sample2',
          count: 2,
        },
      ],
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

it('should open solutions tab', async () => {
  engine.mock('solution_searchSolutions', (params, count) => {
    if (count === 1) {
      return {
        cursor: null,
        items: [],
      };
    }
    if (count === 2) {
      return {
        cursor: 'c1',
        items: solutions.slice(0, 2),
      };
    }
    if (count === 3) {
      return {
        cursor: null,
        items: solutions.slice(2, 4),
      };
    }
    return {
      cursor: null,
      items: [],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solutions-tab').click();
  await $('@solution-details-s1').expect.toBeVisible();
  await $('@solution-details-s2').expect.toBeVisible();
  await $('@solution-details-s3').expect.toBeHidden();
  await $('@load-more-btn').click();
  await $('@solution-details-s1').expect.toBeVisible();
  await $('@solution-details-s2').expect.toBeVisible();
  await $('@solution-details-s3').expect.toBeVisible();
  await $('@solution-details-s4').expect.toBeVisible();
  await $('@load-more-btn').expect.toBeHidden();
});

it('should open solutions tab on clicking solution tag', async () => {
  engine.mock('solution_searchSolutions', (params, count) => {
    if (count === 1) {
      return {
        cursor: null,
        items: solutions.slice(0, 2),
      };
    }
    expect(params).toEqual<typeof params>({
      challengeId: 1,
      cursor: null,
      sortBy: 'likes',
      sortDesc: true,
      tags: ['react'],
    });
    return {
      cursor: null,
      items: [],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solution-s1 @tag:first-child').click();
});

it('should open login popup if clicking submit as anonymous', async () => {
  engine.setToken(null);
  engine.mock('challenge_getChallengeById', (params, count) => {
    const challenges = getChallenges(count === 2);
    return challenges[0];
  });
  engine.mock('user_login', (values, count) => {
    return authData1Verified;
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@create-solution-btn').expect.toBeHidden();
  await $('@submit-btn').click();
  await $('@login-form').expect.toBeVisible();
  await $('@challenge-title').expect.toBeVisible();
  await $('@submit-modal').expect.toBeHidden();
  await $('@login-input').type('a');
  await $('@password-input').type('a');
  await $('@login-submit').click();
  await $('@login-form').expect.toBeHidden();
  await $('@create-solution-btn').expect.toBeVisible();
  await $('@submit-btn').click();
  await $('@submit-modal').expect.toBeVisible();
});

it('should open login popup if clicking like as anonymous', async () => {
  engine.setToken(null);
  engine.mock('challenge_getChallengeById', (params, count) => {
    const challenges = getChallenges(count === 2);
    return challenges[0];
  });
  engine.mock('solution_searchSolutions', () => {
    return {
      cursor: null,
      items: solutions.slice(0, 2),
    };
  });
  engine.mock('solution_voteSolution', () => {
    throw new Error('Should not be called');
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solution-s1 @like').click();
  await $('@login-form').expect.toBeVisible();
});

it('should open error popup if submitting as unverified', async () => {
  engine.mock('challenge_getChallengeById', () => {
    const challenges = getChallenges(true);
    return challenges[0];
  });
  engine.mock('user_getMe', () => {
    return authData1.user;
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@submit-btn').click();
  await $('@error-modal').expect.toBeVisible();
  await $('@error-msg').expect.toMatch(
    'You must verify email to perform this action.'
  );
});

it('should open error popup if liking as unverified', async () => {
  engine.mock('challenge_getChallengeById', () => {
    const challenges = getChallenges(true);
    return challenges[0];
  });
  engine.mock('user_getMe', () => {
    return authData1.user;
  });
  engine.mock('solution_searchSolutions', () => {
    return {
      cursor: null,
      items: solutions.slice(0, 2),
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solution-s1 @like').click();
  await $('@error-modal').expect.toBeVisible();
  await $('@error-msg').expect.toMatch(
    'You must verify email to perform this action.'
  );
});
