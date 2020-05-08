import { Engine, MockError } from './lib/Engine';
import { WEBSITE_URL } from './config';
import { solutions, authData2Verified } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();

  engine.mock('user_getMe', () => {
    return authData2Verified.user;
  });
  engine.mock('user_getPublicProfile', () => {
    return {
      avatarUrl: '',
      bio: 'My bio',
      country: 'PL',
      followersCount: 0,
      followingCount: 0,
      id: 'u1',
      isFollowed: false,
      likesCount: 10,
      name: 'John Doe',
      solutionsCount: 5,
      submissionsCount: 20,
      url: 'https://my-link',
      username: 'user1',
    };
  });
});

it('should open a public profile', async () => {
  await page.goto(WEBSITE_URL + '/profile/user1');
  await $('@profile-info @name').expect.toMatch('John Doe');
  await $('@profile-info @country').expect.toMatch('🇵🇱 Poland');
  await $('@profile-info @bio').expect.toMatch('“My bio“');
  await $('@profile-info @url').expect.toMatch('https://my-link');
  await $('@profile-info @url').expect.toMatchAttr('href', 'https://my-link');
  await $('@solutions-tab').expect.toMatch('Solutions (5)');
  await $('@likes-tab').expect.toMatch('Likes (10)');
});

it('should handle not found user', async () => {
  engine.mock('user_getPublicProfile', () => {
    throw new MockError('User not found');
  });
  await page.goto(WEBSITE_URL + '/profile/user123');
  await $('@user-not-found').expect.toMatch("User doesn't exist");
});

it('should navigate between profiles', async () => {
  engine.mock('user_getPublicProfile', (params, count) => {
    if (count === 1) {
      return {
        avatarUrl: '',
        bio: 'My bio',
        country: 'PL',
        followersCount: 0,
        followingCount: 0,
        id: 'u1',
        isFollowed: false,
        likesCount: 10,
        name: 'John Doe',
        solutionsCount: 5,
        submissionsCount: 20,
        url: 'https://my-link',
        username: 'user1',
      };
    } else {
      return {
        avatarUrl: '',
        bio: 'My bio',
        country: 'DE',
        followersCount: 0,
        followingCount: 0,
        id: 'u2',
        isFollowed: false,
        likesCount: 10,
        name: 'other user',
        solutionsCount: 5,
        submissionsCount: 20,
        url: 'https://my-link',
        username: 'user2',
      };
    }
  });
  engine.setToken('t2');
  await page.goto(WEBSITE_URL + '/profile/user1');
  await $('@current-username').click();
  await $('@my-profile-link').click();
  await $('@profile-info @name').expect.toMatch('other user');
  await $('@profile-info @country').expect.toMatch('🇩🇪 Germany');
});

describe('solutions tab', () => {
  function getValidSolutions() {
    return solutions.filter(x => x.user.username === 'user1');
  }

  it('should open a solutions tab (no solutions)', async () => {
    engine.mock('solution_searchSolutions', (params, count) => {
      if (count === 1) {
        return {
          cursor: null,
          items: [],
        };
      }
      throw new Error('Not expected');
    });
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@solutions-tab').click();
    await $('@no-solutions').expect.toMatch('No Solutions');
  });

  it('should load more', async () => {
    engine.mock('solution_searchSolutions', (params, count) => {
      if (count === 1) {
        return {
          cursor: 'abc',
          items: getValidSolutions().slice(0, 2),
        };
      }
      return {
        cursor: null,
        items: getValidSolutions().slice(2, 4),
      };
    });
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@solutions-tab').click();
    await $('@solution-details-s2').expect.toBeVisible();
    await $('@solution-details-s4').expect.toBeVisible();
    await $('@solution-details-s6').expect.toBeHidden();
    await $('@solution-details-s8').expect.toBeHidden();
    await $('@load-more-btn').click();
    await $('@solution-details-s6').expect.toBeVisible();
    await $('@solution-details-s8').expect.toBeVisible();
  });

  it('should open solution details', async () => {
    engine.mock('solution_searchSolutions', () => {
      return {
        cursor: null,
        items: getValidSolutions().slice(0, 2),
      };
    });
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@solutions-tab').click();
    await $('@solution-details-s2').expect.toBeVisible();
    await $('@solution-details-s2 @title').click();
    await $('@solution-modal @title').expect.toMatch('Solution 2');
  });

  it('should like solution', async () => {
    engine.setToken('t1');
    engine.mock('solution_searchSolutions', () => {
      return {
        cursor: null,
        items: getValidSolutions().slice(0, 2),
      };
    });
    engine.mock('solution_voteSolution', () => {
      return 11;
    });
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@solutions-tab').click();
    await $('@solution-details-s2 @like a').click();
    await $('@solution-details-s2 @like').expect.toMatch('11');
  });

  it('should update solution', async () => {
    engine.setToken('t1');
    engine.mock('solution_searchSolutions', () => {
      return {
        cursor: null,
        items: getValidSolutions().slice(0, 2),
      };
    });
    engine.mock('solution_updateSolution', props => {
      return {
        ...getValidSolutions()[0],
        title: 'edited',
      };
    });
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@solutions-tab').click();
    await $('@solution-details-s2 @solution-menu-btn').click();
    await $('@edit-btn').click();
    await $('@solution-modal @title').clear();
    await $('@solution-modal @title').type('edited');
    await $('@solution-modal @submit-btn').click();
    await $('@solution-modal @solution-details-s2 @title').expect.toMatch(
      'edited'
    );
    await $('@solution-modal @close-btn').click();
    await $('@solution-modal').expect.toBeHidden();
    await $('@solution-details-s2 @title').expect.toMatch('edited');
  });

  it('should delete solution', async () => {
    engine.setToken('t1');
    engine.mock('solution_searchSolutions', () => {
      return {
        cursor: null,
        items: getValidSolutions().slice(0, 2),
      };
    });
    engine.mock('solution_removeSolution', props => {});
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@solutions-tab').click();
    await $('@solution-details-s2 @solution-menu-btn').click();
    await $('@delete-btn').click();
    await $('@confirm-modal @delete-btn').click();
    await $('@solution-details-s2').expect.toBeHidden();
  });
});

describe('likes tab', () => {
  it('should open a likes tab (no solutions)', async () => {
    engine.mock('solution_searchLikesSolutions', (params, count) => {
      if (count === 1) {
        return {
          cursor: null,
          items: [],
        };
      }
      throw new Error('Not expected');
    });
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@likes-tab').click();
    await $('@no-solutions').expect.toMatch('No liked solutions');
  });

  it('should load more', async () => {
    engine.mock('solution_searchLikesSolutions', (params, count) => {
      if (count === 1) {
        return {
          cursor: 'abc',
          items: solutions.slice(0, 2),
        };
      }
      return {
        cursor: null,
        items: solutions.slice(2, 4),
      };
    });
    await page.goto(WEBSITE_URL + '/profile/user1');
    await $('@likes-tab').click();
    await $('@solution-details-s1').expect.toBeVisible();
    await $('@solution-details-s2').expect.toBeVisible();
    await $('@solution-details-s3').expect.toBeHidden();
    await $('@solution-details-s4').expect.toBeHidden();
    await $('@load-more-btn').click();
    await $('@solution-details-s3').expect.toBeVisible();
    await $('@solution-details-s4').expect.toBeVisible();
  });
});
