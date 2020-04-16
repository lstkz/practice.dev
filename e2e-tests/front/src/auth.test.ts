import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { emptyChallenges, authData1, authData1Verified } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

describe('register', () => {
  it('should open registration from landing page', async () => {
    await page.goto(WEBSITE_URL);
    await $('@top-register-btn').click();
    await $('@register-form').expect.toBeVisible();
  });

  it('should open registration from challenges page', async () => {
    await page.goto(WEBSITE_URL + '/challenges');
    await $('@header-register-btn').click();
    await $('@register-form').expect.toBeVisible();
  });

  it('should open registration from login page', async () => {
    await page.goto(WEBSITE_URL + '/login');
    await $('@register-link').expect.toBeVisible();
  });

  it('should open registration from reset password page', async () => {
    await page.goto(WEBSITE_URL + '/reset-password');
    await $('@register-link').expect.toBeVisible();
  });

  it('register with errors', async () => {
    await page.goto(WEBSITE_URL + '/register');
    await $('@register-submit').click();
    await $('@username-input_error').expect.toMatch('This field is required');
    await $('@email-input_error').expect.toMatch('This field is required');
    await $('@password-input_error').expect.toMatch('This field is required');
    await $('@confirm-password-input_error').expect.toMatch(
      'This field is required'
    );
    await $('@username-input').type('u');
    await $('@username-input_error').expect.toMatch(
      'Length must be at least 3 characters long'
    );
    await $('@username-input').type('ser1');
    await $('@email-input').type('u');
    await $('@email-input_error').expect.toMatch('Must a valid email');
    await $('@email-input').type('1@g.com');
    await $('@password-input').type('1');
    await $('@password-input_error').expect.toMatch(
      'Length must be at least 4 characters long'
    );
    await $('@password-input').type('2345');
    await $('@confirm-password-input').type('1');
    await $('@confirm-password-input_error').expect.toMatch(
      'Passwords do not match'
    );
    await $('@confirm-password-input').type('2345');
    await $('@username-input_error').expect.toBeHidden();
    await $('@email-input_error').expect.toBeHidden();
    await $('@password-input_error').expect.toBeHidden();
    await $('@confirm-password-input_error').expect.toBeHidden();

    engine.mock('user_register', (values, count) => {
      expect(values).toEqual<typeof values>({
        email: 'u1@g.com',
        password: '12345',
        username: 'user1',
      });
      if (count === 1) {
        throw new MockError('Username is already taken');
      }
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await $('@register-submit').click();
    await $('@register-error').expect.toMatch('Username is already taken');
    await $('@register-submit').click();
    await $('@challenges-page').expect.toBeVisible();
  });

  it('register', async () => {
    engine.mock('user_register', (values, count) => {
      expect(values).toEqual<typeof values>({
        email: 'u1@g.com',
        password: '12345',
        username: 'user1',
      });
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await page.goto(WEBSITE_URL + '/register');
    await $('@username-input').type('user1');
    await $('@email-input').type('u1@g.com');
    await $('@password-input').type('12345');
    await $('@confirm-password-input').type('12345');
    await $('@register-submit').click();
    await $('@challenges-page').expect.toBeVisible();
  });

  it('register with github', async () => {
    engine.mock('user_authGithub', (values, count) => {
      expect(values).toEqual<typeof values>('foo');
      if (count === 1) {
        throw new MockError('social error');
      }
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await page.goto(WEBSITE_URL + '/register');
    await $('@social-github-btn').expect.toBeVisible();
    await page.evaluate(() => {
      (window as any).githubCallback('foo');
    });
    await $('@register-error').expect.toMatch('social error');
    await page.evaluate(() => {
      (window as any).githubCallback('foo');
    });
    await $('@challenges-page').expect.toBeVisible();
  });

  it('register with google', async () => {
    engine.mock('user_authGoogle', (values, count) => {
      expect(values).toEqual<typeof values>('foo');
      if (count === 1) {
        throw new MockError('social error');
      }
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await page.goto(WEBSITE_URL + '/register');
    await $('@social-google-btn').expect.toBeVisible();
    await page.evaluate(() => {
      (window as any).googleCallback('foo');
    });
    await $('@register-error').expect.toMatch('social error');
    await page.evaluate(() => {
      (window as any).googleCallback('foo');
    });
    await $('@challenges-page').expect.toBeVisible();
  });
});

describe('login', () => {
  it('should open login from landing page', async () => {
    await page.goto(WEBSITE_URL);
    await $('@top-login-btn').click();
    await $('@login-form').expect.toBeVisible();
  });

  it('should open login from challenges page', async () => {
    await page.goto(WEBSITE_URL + '/challenges');
    await $('@header-login-btn').click();
    await $('@login-form').expect.toBeVisible();
  });

  it('should open login from register page', async () => {
    await page.goto(WEBSITE_URL + '/register');
    await $('@login-link').expect.toBeVisible();
  });

  it('login with errors', async () => {
    await page.goto(WEBSITE_URL + '/login');
    await $('@login-submit').click();
    await $('@login-input_error').expect.toMatch('This field is required');
    await $('@password-input_error').expect.toMatch('This field is required');
    await $('@login-input').type('user1');
    await $('@password-input').type('12345');
    await $('@login-input_error').expect.toBeHidden();
    await $('@password-input_error').expect.toBeHidden();

    engine.mock('user_login', (values, count) => {
      expect(values).toEqual<typeof values>({
        password: '12345',
        emailOrUsername: 'user1',
      });
      if (count === 1) {
        throw new MockError('Invalid credentials');
      }
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await $('@login-submit').click();
    await $('@login-error').expect.toMatch('Invalid credentials');
    await $('@login-submit').click();
    await $('@challenges-page').expect.toBeVisible();
  });

  it('login', async () => {
    await page.goto(WEBSITE_URL + '/login');
    await $('@login-input').type('user1');
    await $('@password-input').type('12345');

    engine.mock('user_login', (values, count) => {
      expect(values).toEqual<typeof values>({
        password: '12345',
        emailOrUsername: 'user1',
      });
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await $('@login-submit').click();
    await $('@challenges-page').expect.toBeVisible();
  });

  it('login with github', async () => {
    engine.mock('user_authGithub', (values, count) => {
      expect(values).toEqual<typeof values>('foo');
      if (count === 1) {
        throw new MockError('social error');
      }
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await page.goto(WEBSITE_URL + '/login');
    await $('@social-github-btn').expect.toBeVisible();
    await page.evaluate(() => {
      (window as any).githubCallback('foo');
    });
    await $('@login-error').expect.toMatch('social error');
    await page.evaluate(() => {
      (window as any).githubCallback('foo');
    });
    await $('@challenges-page').expect.toBeVisible();
  });

  it('login with google', async () => {
    engine.mock('user_authGoogle', (values, count) => {
      expect(values).toEqual<typeof values>('foo');
      if (count === 1) {
        throw new MockError('social error');
      }
      return authData1;
    });
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    await page.goto(WEBSITE_URL + '/login');
    await $('@social-google-btn').expect.toBeVisible();
    await page.evaluate(() => {
      (window as any).googleCallback('foo');
    });
    await $('@login-error').expect.toMatch('social error');
    await page.evaluate(() => {
      (window as any).googleCallback('foo');
    });
    await $('@challenges-page').expect.toBeVisible();
  });
});

describe('reset password', () => {
  it('should open login from login page', async () => {
    await page.goto(WEBSITE_URL + '/login');
    await $('@reset-password-link').click();
    await $('@reset-password-form').expect.toBeVisible();
  });

  it('reset password with errors', async () => {
    engine.mock('user_resetPassword', (values, count) => {
      if (count === 1) {
        throw new MockError('User is not registered');
      }
      expect(values).toEqual<typeof values>('u1@g.com');
    });
    await page.goto(WEBSITE_URL + '/reset-password');
    await $('@reset-password-form').expect.toBeVisible();
    await $('@reset-password-submit').click();
    await $('@email-input_error').expect.toMatch('This field is required');
    await $('@email-input').type('u');
    await $('@email-input_error').expect.toMatch('Must a valid email');
    await $('@email-input').type('1@g.com');
    await $('@reset-password-submit').click();
    await $('@reset-password-error').expect.toMatch('User is not registered');
    await $('@reset-password-submit').click();
    await $('@reset-password-success').expect.toBeVisible();
  });

  it('reset password with errors', async () => {
    engine.mock('user_resetPassword', (values, count) => {
      expect(values).toEqual<typeof values>('u1@g.com');
    });
    await page.goto(WEBSITE_URL + '/reset-password');
    await $('@email-input').type('u1@g.com');
    await $('@reset-password-submit').click();
    await $('@reset-password-success').expect.toBeVisible();
  });
});

describe('confirm reset password', () => {
  it('confirm password - invalid code', async () => {
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    engine.mock('user_confirmEmail', () => {
      throw new MockError('Invalid code');
    });
    await page.goto(WEBSITE_URL + '/confirm/foo');
    await $('@app-error').expect.toMatch('Invalid code');
  });

  it('confirm password', async () => {
    engine.mock('challenge_searchChallenges', () => {
      return emptyChallenges;
    });
    engine.mock('user_confirmEmail', () => {
      return authData1Verified;
    });
    await page.goto(WEBSITE_URL + '/confirm/foo');
    await $('@challenges-page').expect.toBeVisible();
    await $('@app-error').expect.toBeHidden();
  });
});
