import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { authData1Verified, getChallenges, authData1 } from './test-data';

let engine: Engine = null!;

const getBaseComment = (text = 'comm1') => ({
  challengeId: 1,
  createdAt: new Date(2000, 1, 1).toISOString(),
  children: [],
  isAnswer: false,
  isAnswered: false,
  isDeleted: false,
  text,
  html: text,
  user: {
    id: authData1.user.id,
    username: authData1.user.username,
  },
});

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

it('should load empty discussion', async () => {
  engine.mock('discussion_searchComments', params => {
    expect(params).toEqual<typeof params>({
      challengeId: 1,
      sortDesc: true,
      cursor: null,
    });
    return {
      cursor: null,
      items: [],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@no-comments').expect.toMatch('No Comments');
});

it('should load discussion and load more', async () => {
  engine.mock('discussion_searchComments', (params, count) => {
    if (count === 1) {
      return {
        cursor: 'abc',
        items: [
          {
            ...getBaseComment('com1'),
            id: '1',
            text: 'com1',
          },
          {
            ...getBaseComment('com2'),
            id: '2',
            text: 'com2',
          },
        ],
      };
    }
    expect(params).toEqual<typeof params>({
      challengeId: 1,
      sortDesc: true,
      cursor: 'abc',
    });
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment('com3'),
          id: '3',
        },
      ],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-1').expect.toBeVisible();
  await $('@comment-1 @text').expect.toMatch('com1');
  await $('@comment-2').expect.toBeVisible();
  await $('@comment-2 @text').expect.toMatch('com2');
  await $('@load-more-btn').click();
  await $('@comment-3').expect.toBeVisible();
  await $('@comment-3 @text').expect.toMatch('com3');
  await $('@load-more-btn').expect.toBeHidden();
});

it('should display nested comments with answered and deleted', async () => {
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: 'abc',
      items: [
        {
          ...getBaseComment('com1'),
          id: '1',
          isAnswered: true,
          children: [
            {
              ...getBaseComment('com2'),
              id: '2',
            },
            {
              ...getBaseComment('com3'),
              id: '3',
              isAnswer: true,
            },
            {
              ...getBaseComment(''),
              id: '4',
              isDeleted: true,
            },
          ],
        },
        {
          ...getBaseComment('coma5'),
          id: '2',
          text: 'coma5',
        },
      ],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-1 @answered-tag').expect.toBeVisible();
  await $('@comment-5 @answered-tag').expect.toBeHidden();
  await $('@comment-4 @text').expect.toMatch('[Deleted]');
});

it('should show discussion as anonymous user', async () => {
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment('com1'),
          id: '1',
          children: [
            {
              ...getBaseComment('com2'),
              id: '2',
            },
          ],
        },
      ],
    };
  });
  engine.setToken(null);
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-1').expect.toBeVisible();
  await $('@new-comment-input').expect.toBeHidden();
  await $('@comment-menu-btn').expect.toBeHidden();
  await $('@reply-btn').expect.toBeHidden();
});

it('should preview comment', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [],
    };
  });
  engine.mock('discussion_previewComment', (params, count) => {
    expect(params).toEqual<typeof params>('**a**');
    return 'fake html';
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@new-comment-input').type('**a**');
  await $('@preview-btn').click();
  await $('@comment-preview').expect.toMatch('fake html');
});

it('should add a new comment (from empty)', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [],
    };
  });
  engine.mock('discussion_createComment', (params, count) => {
    expect(params).toEqual<typeof params>({
      challengeId: 1,
      text: 'foo',
    });
    if (count === 1) {
      throw new MockError('Err');
    }
    return {
      ...getBaseComment('foo'),
      id: '1',
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
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

it('should add a new nested comment', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment(),
          id: '1',
        },
      ],
    };
  });
  engine.mock('discussion_createComment', (params, count) => {
    expect(params).toEqual<typeof params>({
      challengeId: 1,
      text: 'foo',
      parentCommentId: '1',
    });
    return {
      ...getBaseComment('foo'),
      parentCommentId: '1',
      id: '2',
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-1 @reply-btn').click();
  await $('@comment-1 @new-comment-input').type('foo');
  await $('@comment-1 @cancel-comment-btn').click();
  await $('@comment-1 @reply-btn').click();
  await $('@comment-1 @new-comment-input').type('foo');
  await $('@comment-1 @post-comment-btn').click();
  await $('@comment-1 @comment-2 @text').expect.toMatch('foo');
});

it('should remove a comment', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment(),
          id: '1',
        },
      ],
    };
  });
  engine.mock('discussion_deleteComment', (params, count) => {
    if (count === 1) {
      throw new MockError('foo');
    }
    expect(params).toEqual<typeof params>('1');
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-1 @comment-menu-btn').click();
  await $('@delete-btn').click();
  await $('@confirm-modal @delete-btn').click();
  await $('@confirm-modal').expect.toBeHidden();
  await $('@app-error').expect.toMatch('foo');
  await $('@comment-1 @comment-menu-btn').click();
  await $('@delete-btn').click();
  await $('@confirm-modal @delete-btn').click();
  await $('@comment-1 @text').expect.toMatch('[Deleted]');
});

it('should change sort', async () => {
  await page.goto(WEBSITE_URL + '/challenges/1');
  engine.mock('discussion_searchComments', (params, count) => {
    if (count === 2) {
      expect(params.sortDesc).toEqual(false);
      return {
        cursor: null,
        items: [
          {
            ...getBaseComment('comm2'),
            id: '2',
          },
        ],
      };
    }
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment('comm1'),
          id: '1',
        },
      ],
    };
  });
  engine.mock('discussion_deleteComment', (params, count) => {
    if (count === 1) {
      throw new MockError('foo');
    }
    expect(params).toEqual<typeof params>('1');
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-1').expect.toBeVisible();
  await $('#sortBy').click();
  await $('.react-select__option').clickByText('Oldest');
  await $('@comment-2').expect.toBeVisible();
});

it('mark comment answered should be hidden if not admin', async () => {
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment('com1'),
          id: '1',
          children: [
            {
              ...getBaseComment('com2'),
              id: '2',
              parentCommentId: '1',
            },
            {
              ...getBaseComment('com3'),
              id: '3',
              parentCommentId: '1',
            },
          ],
        },
        {
          ...getBaseComment('com4'),
          id: '4',
        },
      ],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-3 @comment-menu-btn').click();
  await $('@delete-btn').expect.toBeVisible();
  await $('@set-answer-btn').expect.toBeHidden();
});

it('should mark comment answered', async () => {
  engine.mock('user_getMe', () => {
    return {
      ...authData1Verified.user,
      isAdmin: true,
    };
  });
  engine.mock('discussion_markAnswer', () => {
    //
  });
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment('com1'),
          id: '1',
          children: [
            {
              ...getBaseComment('com2'),
              id: '2',
              parentCommentId: '1',
            },
            {
              ...getBaseComment('com3'),
              id: '3',
              parentCommentId: '1',
            },
          ],
        },
        {
          ...getBaseComment('com4'),
          id: '4',
        },
      ],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@comment-3 @comment-menu-btn').click();
  await $('@set-answer-btn').click();
  await $('@comment-1 @answered-tag').expect.toBeVisible();
});

it('should display an error if posting as unverified', async () => {
  engine.mock('user_getMe', () => {
    return authData1.user;
  });
  engine.mock('discussion_searchComments', () => {
    return {
      cursor: null,
      items: [
        {
          ...getBaseComment('com1'),
          id: '1',
          children: [],
        },
      ],
    };
  });
  await page.goto(WEBSITE_URL + '/challenges/1');
  await $('@discussion-tab').click();
  await $('@new-comment-input').type('foo');
  await $('@post-comment-btn').click();
  await $('@error-msg').expect.toMatch(
    'You must verify email to perform this action.'
  );
  await $('@close-btn').click();
  await $('@error-modal').expect.toBeHidden();
  await $('@comment-1 @reply-btn').click();
  await $('@comment-1 @new-comment-input').type('foo');
  await $('@comment-1 @post-comment-btn').click();
  await $('@error-msg').expect.toMatch(
    'You must verify email to perform this action.'
  );
});

it('should unsubscribe', async () => {
  engine.mock('discussion_unsubscribe', (params, count) => {
    expect(params).toEqual<typeof params>('123');
    if (count === 1) {
      throw new MockError('err');
    }
  });
  await page.goto(WEBSITE_URL + '/challenges/1?unsubscribe=123');
  await $('@app-error').expect.toMatch('Cannot unsubscribe');
  await page.reload();
  await $('@app-success').expect.toMatch('Unsubscribed successfully');
  await $('@app-success a').click();
  await $('@app-success').expect.toBeHidden();
});
