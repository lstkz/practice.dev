import { resetDb } from '../helper';
import { registerSampleUsers, addSampleTasks } from '../seed-data';
import { submit } from '../../src/contracts/submission/submit';
import { sns } from '../../src/lib';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleTasks()]);
});

describe('validation', () => {
  test.each([
    [
      {
        challengeId: 1,
        testUrl: 'aqw',
      },
      "Validation error: 'values.testUrl' must match regex",
    ],
    [
      {
        challengeId: 3422,
        testUrl: 'http://example.com',
      },
      'Challenge "3422" does not exist',
    ],
  ])('.submit(%p) should throw `%s`', async (input: any, errorMessage: any) => {
    await expect(submit(userId, input)).rejects.toThrow(errorMessage);
  });
});

it('submit successfully', async () => {
  const spy = jest.spyOn(sns, 'publish');
  spy.mockImplementation(
    () =>
      ({
        promise: () => Promise.resolve(),
      } as any)
  );
  await submit(userId, {
    challengeId: 1,
    testUrl: 'http://example.com',
  });

  expect(spy).toHaveBeenCalled();
});
