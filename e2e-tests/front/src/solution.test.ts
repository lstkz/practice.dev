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
    challenges[0].isSolved = true;
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
      items: [],
    };
  });
  engine.setMockedBundle('example challenge details');
  engine.setToken('t1');
});

it('should create a solution with errors', async () => {
  engine.mock('challenge_getChallengeById', () => {
    const challenges = getChallenges(false);
    challenges[0].isSolved = true;
    return challenges[0];
  });
  engine.mock('solution_createSolution', (params, count) => {
    if (count === 1) {
      throw new MockError('Some Error');
    }
    expect(params).toEqual<typeof params>({
      challengeId: 1,
      description: 'desc',
      slug: 'my-solution',
      tags: ['foo'],
      title: 'My Solution',
      url: 'https://github.com/a/b',
    });
    return {
      ...params,
      createdAt: new Date().toISOString(),
      id: 's1',
      isLiked: false,
      likes: 0,
      challengeId: 1,
      user: {
        id: 'u1',
        username: 'user1',
      },
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@create-solution-btn').click();
  await $('@submit-btn').click();
  await $('@url_error').expect.toMatch('This field is required');
  await $('@title_error').expect.toMatch('This field is required');
  await $('@slug_error').expect.toMatch('This field is required');
  await $('@tags_error').expect.toMatch('This field is required');
  await $('@url').type('https://');
  await $('@url_error').expect.toMatch('Invalid URL');
  await $('@url').type('github.com/a/b');
  await $('@title').type('My Solution');
  await $('@slug').expect.toMatch('my-solution');
  await $('@share-url').expect.toMatch(
    WEBSITE_URL + '/challenges/1?s=my-solution'
  );
  await $('@tags').click();
  await $('@tags input').type('foo');
  await $('@tags input').press('Enter');
  await $('@description').type('desc');
  await $('@submit-btn').click();
  await $('@solution-error').expect.toMatch('Some Error');
  await $('@submit-btn').click();
  await $('@solution-details-s1 @title').expect.toMatch('My Solution');
  expect(page.url()).toMatch(WEBSITE_URL + '/challenges/1?s=my-solution');
});

it('delete solution', async () => {
  engine.mock('solution_searchSolutions', () => {
    return {
      cursor: null,
      items: solutions.slice(0, 2),
    };
  });
  engine.mock('solution_removeSolution', params => {
    expect(params).toEqual<typeof params>('s2');
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solution-s2').expect.toBeVisible();
  await $('@solutions-tab').click();
  await $('@solution-details-s2').expect.toBeVisible();
  await $('@details-tab').click();
  await $('@solution-s2 @title').click();
  await $('@solution-menu-btn').click();
  await $('@solution-menu @delete-btn').click();
  await $('@confirm-modal').expect.toBeVisible();
  await $('@confirm-modal @close-btn').click();
  await $('@confirm-modal').expect.toBeHidden();
  await $('@solution-menu-btn').click();
  await $('@solution-menu @delete-btn').click();
  await $('@confirm-modal @delete-btn').click();
  await $('@confirm-modal').expect.toBeHidden();
  await $('@solution-s2').expect.toBeHidden();
  await $('@solutions-tab').click();
  await $('@solution-details-s2').expect.toBeHidden();
  await $('@solution-details-s1').expect.toBeVisible();
});

it('like solution', async () => {
  engine.mock('solution_searchSolutions', () => {
    return {
      cursor: null,
      items: solutions.slice(0, 2),
    };
  });
  engine.mock('solution_voteSolution', (params, count) => {
    if (count === 1) {
      expect(params).toEqual<typeof params>({
        like: true,
        solutionId: 's1',
      });
      return 11;
    }
    expect(params).toEqual<typeof params>({
      like: false,
      solutionId: 's1',
    });
    return 10;
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solution-s1 @like').click();
  await $('@solution-s1 @like').expect.toMatch('11');
  await $('@solution-s1 @like').click();
  await $('@solution-s1 @like').expect.toMatch('10');
});

it('should open a solution directly from url (error)', async () => {
  engine.mock('solution_getSolutionBySlug', () => {
    throw new MockError('Solution not found');
  });
  await page.goto(WEBSITE_URL + '/challenges/1?s=solution-1');
  await $('@app-error').expect.toMatch('Solution not found');
  expect(page.url()).toMatch(WEBSITE_URL + '/challenges/1');
});

it('should open a solution directly from url and edit', async () => {
  engine.mock('solution_getSolutionBySlug', params => {
    expect(params).toEqual<typeof params>([1, 'solution-2']);
    return solutions[1];
  });
  engine.mock('solution_updateSolution', (params, count) => {
    expect(params).toEqual<typeof params>([
      's2',
      {
        description: 'x',
        slug: 'solution-2x',
        tags: ['react', 'sample3', 'foo'],
        title: 'Solution 2x',
        url: 'https://github.com/foo/barx',
      },
    ]);
    return {
      ...solutions[1],
      ...params[1],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1?s=solution-2');
  await $('@solution-details-s2 @title').expect.toMatch('Solution 2');
  await $('@solution-details-s2 @author').expect.toMatch('@user1');
  await $('@solution-details-s2 @like').expect.toMatch('10');
  await $('@solution-details-s2 @url').expect.toMatch(
    'https://github.com/foo/bar'
  );
  await $('@solution-details-s2 @desc').expect.toMatch('Solution desc 2');
  await $('@solution-details-s2 @date').expect.toMatch('01.01.2000');
  await $('@solution-details-s2 @tag:nth-child(1)').expect.toMatch('react');
  await $('@solution-details-s2 @tag:nth-child(2)').expect.toMatch('sample3');
  await $('@solution-menu-btn').click();
  await $('@solution-menu @edit-btn').click();
  await $('@url').type('x');
  await $('@title').type('x');
  await $('@tags').click();
  await $('@tags input').type('foo');
  await $('@tags input').press('Enter');
  await $('@description').clear();
  await $('@description').type('x');
  await $('@submit-btn').click();
  await $('@solution-details-s2 @title').expect.toMatch('Solution 2x');
  await $('@solution-details-s2 @url').expect.toMatch(
    'https://github.com/foo/barx'
  );
  await $('@solution-details-s2 @desc').expect.toMatch('x');
  await $('@solution-details-s2 @tag:nth-child(1)').expect.toMatch('react');
  await $('@solution-details-s2 @tag:nth-child(2)').expect.toMatch('sample3');
  await $('@solution-details-s2 @tag:nth-child(3)').expect.toMatch('foo');
  expect(page.url()).toMatch(WEBSITE_URL + '/challenges/1?s=solution-2x');
});

it('open solution, close and re-open with back/forward buttons', async () => {
  engine.mock('solution_searchSolutions', () => {
    return {
      cursor: null,
      items: solutions.slice(0, 3),
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@solution-s1 @title').click();
  await $('@solution-modal').expect.toBeVisible();
  await $('@solution-details-s1').expect.toBeVisible();
  await page.goBack();
  await $('@solution-modal').expect.toBeHidden();
  await $('@solution-s2 @title').click();
  await $('@solution-modal').expect.toBeVisible();
  await $('@solution-details-s2').expect.toBeVisible();
  await $('@solution-modal @close-btn').click();
  await $('@solution-modal').expect.toBeHidden();
  await page.goBack();
  await $('@solution-modal').expect.toBeVisible();
  await $('@solution-details-s2').expect.toBeVisible();
  await page.goBack();
  await $('@solution-modal').expect.toBeHidden();
  await page.goForward();
  await $('@solution-modal').expect.toBeVisible();
  await $('@solution-details-s2').expect.toBeVisible();
});
