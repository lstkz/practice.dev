import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { authData1Verified, emptyProjects, getProjects } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.setToken('t1');
});

it('should display empty projects', async () => {
  engine.mock('project_searchProjects', () => emptyProjects);
  await page.goto(WEBSITE_URL + '/projects');
  await $('@no-projects').expect.toMatch('No Projects');
});

it('should display projects as logged in', async () => {
  engine.mock('project_searchProjects', () => {
    const projects = getProjects(true);
    return {
      items: projects.slice(0, 10),
      pageNumber: 0,
      pageSize: 10,
      total: projects.length,
      totalPages: Math.ceil(projects.length / 10),
    };
  });
  await page.goto(WEBSITE_URL + '/projects');
  await $('@project_1 @title').expect.toMatch('Project 1');
  await $('@project_1 @desc').expect.toMatch('Desc 1');
  await $('@project_1 @submissions').expect.toMatch('50');
  await $('@project_1 @solved').expect.toMatch('30');
  await $('@project_1 @view-btn').expect.toMatchAttr('href', '/projects/1');
  await $('@project_1 @tag-domain').expect.toMatch('frontend');
  await $('@project_1 @solved-tag').expect.toMatch('50% SOLVED', true);
  await $('@project_2 @solved-tag').expect.toMatch('SOLVED', true);
  await $('@project_3 @solved-tag').expect.toBeHidden();
});

it('should display projects as logged in', async () => {
  engine.setToken(null);
  engine.mock('project_searchProjects', () => {
    const projects = getProjects(false);
    return {
      items: projects.slice(0, 10),
      pageNumber: 0,
      pageSize: 10,
      total: projects.length,
      totalPages: Math.ceil(projects.length / 10),
    };
  });
  await page.goto(WEBSITE_URL + '/projects');
  await $('@project_1 @title').expect.toMatch('Project 1');
  await $('@project_1 @desc').expect.toMatch('Desc 1');
  await $('@project_1 @submissions').expect.toMatch('50');
  await $('@project_1 @solved').expect.toMatch('30');
  await $('@project_1 @view-btn').expect.toMatchAttr('href', '/projects/1');
  await $('@project_1 @tag-domain').expect.toMatch('frontend');
  await $('@project_1 @solved-tag').expect.toBeHidden();
  await $('@project_2 @solved-tag').expect.toBeHidden();
  await $('@project_3 @solved-tag').expect.toBeHidden();
});

it('should load more projects', async () => {
  // TODO
});

it("should display error if projects can't be loaded", async () => {
  engine.mock('project_searchProjects', () => {
    throw new MockError('API not working');
  });
  await page.goto(WEBSITE_URL + '/projects');
  await $('@app-error').expect.toMatch('API not working');
});

it('should not display solved/unsolved filter if not logged in', async () => {
  engine.setToken(null);
  engine.mock('project_searchProjects', () => {
    return emptyProjects;
  });
  await page.goto(WEBSITE_URL + '/projects');
  await $('@filter-domain').expect.toBeVisible();
  await $('@filter-projects').expect.toBeHidden();
});

it('filter properly (by solved status)', async () => {
  let resolve: any = null;
  let promise = new Promise(r => {
    resolve = r;
  });
  engine.mock('project_searchProjects', (params, count) => {
    // initial
    if (count === 1) {
      expect(params).toEqual<typeof params>({
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: [],
      });
    }
    // check "solved"
    if (count === 2) {
      expect(params).toEqual<typeof params>({
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: ['solved'],
      });
    }
    // check "unsolved", reload
    if (count === 3 || count === 4) {
      expect(params).toEqual<typeof params>({
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: ['solved', 'unsolved'],
      });
    }
    // go back
    if (count === 5) {
      expect(params).toEqual<typeof params>({
        domains: [],
        sortBy: 'created',
        sortOrder: 'asc',
        statuses: ['solved'],
      });
    }
    if (count === 5) {
      resolve();
    }
    return emptyProjects;
  });
  await page.goto(WEBSITE_URL + '/projects');
  await $('@filter-projects @option-solved').click();
  await $('@filter-projects @option-unsolved').click();
  await page.reload();
  await $('@filter-projects @option-solved input:checked').expect.toBeVisible();
  await $(
    '@filter-projects @option-unsolved input:checked'
  ).expect.toBeVisible();
  await page.goBack();
  await $('@filter-projects @option-solved input:checked').expect.toBeVisible();
  await $(
    '@filter-projects @option-unsolved input:not(:checked)'
  ).expect.toBeVisible();
  await promise;
});

it('filter with custom url', async () => {
  engine.mock('project_searchProjects', (params, count) => {
    expect(params).toEqual<typeof params>({
      domains: ['backend'],
      sortBy: 'created',
      sortOrder: 'desc',
      statuses: ['solved'],
    });
    return emptyProjects;
  });

  await page.goto(
    WEBSITE_URL + '/projects?status=solved&domain=backend&sortOrder=newest'
  );

  const expectIsChecked = (input: string) =>
    $(`${input} input:checked`).expect.toBeVisible();
  const expectIsNotChecked = (input: string) =>
    $(`${input} input:not(:checked)`).expect.toBeVisible();
  // projects
  await expectIsChecked('@filter-projects @option-solved');
  await expectIsNotChecked('@filter-projects @option-unsolved');
  await expectIsNotChecked('@filter-projects @option-partial');
  // domain
  await expectIsNotChecked('@filter-domain @option-frontend');
  await expectIsChecked('@filter-domain @option-backend');
  await expectIsNotChecked('@filter-domain @option-fullstack');
  // sort
  await $('@filter-sort .react-select__single-value').expect.toMatch('Newest');
});
