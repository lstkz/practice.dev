import { WEBSITE_URL } from './config';
import { Engine } from './lib/Engine';
import {
  authData1Verified,
  getProjects,
  getProjectChallenges,
} from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
});

it('should open project as anonymous', async () => {
  engine.mock('project_getProjectById', () => {
    return {
      project: getProjects(false)[0],
      challenges: getProjectChallenges(false),
    };
  });
  await page.goto(WEBSITE_URL + '/projects/1');
  await $('@project @title').expect.toMatch('Project 1');
  await $('@project @submissions').expect.toMatch('50');
  await $('@project @solved').expect.toMatch('30');
  await $('@challenge_1 @title').expect.toMatch('Challenge 1');
  await $('@challenge_1 @solve-btn').expect.toMatchAttr(
    'href',
    '/projects/1/challenges/1'
  );
  await $('@challenge_2 @title').expect.toMatch('Locked');
  await $('@challenge_2 @solve-btn').expect.toMatchAttr('disabled', '');
  await $('@challenge_3 @title').expect.toMatch('Locked');
  await $('@challenge_4 @title').expect.toMatch('Locked');
  await $('@challenge_1 @submissions').expect.toMatch('20');
  await $('@challenge_1 @solved').expect.toMatch('10');
});

it('should open project as logged in', async () => {
  engine.setToken('t1');
  engine.mock('project_getProjectById', () => {
    const challenges = getProjectChallenges(true);
    challenges[0].isSolved = true;
    challenges[1].isSolved = true;
    challenges[1].isLocked = false;
    challenges[2].isLocked = false;
    challenges[2].isSolved = false;
    challenges[3].isLocked = true;
    challenges[3].isSolved = false;
    return {
      project: getProjects(true)[0],
      challenges,
    };
  });
  await page.goto(WEBSITE_URL + '/projects/1');
  await $('@project @title').expect.toMatch('Project 1');
  await $('@project @solved-tag').expect.toMatch('50% SOLVED');

  await $('@challenge_1 @title').expect.toMatch('Challenge 1');
  await $('@challenge_1 @solved-tag').expect.toBeVisible();
  await $('@challenge_2 @title').expect.toMatch('Challenge 2');
  await $('@challenge_2 @solved-tag').expect.toBeVisible();
  await $('@challenge_3 @title').expect.toMatch('Challenge 3');
  await $('@challenge_3 @solved-tag').expect.toBeHidden();
  await $('@challenge_4 @title').expect.toMatch('Locked');
});
