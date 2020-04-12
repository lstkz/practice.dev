import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { emptyChallenges, authData1 } from './test-data';

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
    engine.mock('challenge_searchChallenges', (values, count) => {
      return emptyChallenges;
    });
    await $('@register-submit').click();
    await $('@register-error').expect.toMatch('Username is already taken');
    await $('@register-submit').click();
    await $('@challenges-page').expect.toBeVisible();
  });
});
