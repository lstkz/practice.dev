import { resetDb } from '../helper';
import {
  registerSampleUsers,
  addSampleChallenges,
  addSampleProjects,
} from '../seed-data';
import { submit } from '../../src/contracts/submission/submit';
import { sns } from '../../src/lib';
import { createProjectChallengeSolvedCUD } from '../../src/cud/projectChallengeSolved';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
});

describe('normal', () => {
  beforeEach(async () => {
    await addSampleChallenges();
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
        'Challenge not found',
      ],
    ])('.submit(%p) should throw `%s`', async (input, errorMessage) => {
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
});

describe('project', () => {
  beforeEach(async () => {
    await addSampleProjects();
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
          challengeId: 1,
          projectId: 13333,
          testUrl: 'http://example.com',
        },
        'Project not found',
      ],
      [
        {
          challengeId: 3422,
          projectId: 1,
          testUrl: 'http://example.com',
        },
        'Project Challenge not found',
      ],
    ])('.submit(%p) should throw `%s`', async (input, errorMessage) => {
      await expect(submit(userId, input)).rejects.toThrow(errorMessage);
    });
  });

  it('submit successfully (challenge = 1)', async () => {
    const spy = jest.spyOn(sns, 'publish');
    spy.mockImplementation(
      () =>
        ({
          promise: () => Promise.resolve(),
        } as any)
    );
    await submit(userId, {
      projectId: 1,
      challengeId: 1,
      testUrl: 'http://example.com',
    });

    expect(spy).toHaveBeenCalled();
  });

  it('submit successfully (challenge = 3, previous challenges are solved)', async () => {
    await createProjectChallengeSolvedCUD({
      challengeId: 1,
      projectId: 1,
      solvedAt: 1,
      userId,
    });
    await createProjectChallengeSolvedCUD({
      challengeId: 2,
      projectId: 1,
      solvedAt: 1,
      userId,
    });
    const spy = jest.spyOn(sns, 'publish');
    spy.mockImplementation(
      () =>
        ({
          promise: () => Promise.resolve(),
        } as any)
    );
    await submit(userId, {
      projectId: 1,
      challengeId: 3,
      testUrl: 'http://example.com',
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should throw error if no permissions', async () => {
    await createProjectChallengeSolvedCUD({
      challengeId: 1,
      projectId: 1,
      solvedAt: 1,
      userId,
    });
    const spy = jest.spyOn(sns, 'publish');
    spy.mockImplementation(
      () =>
        ({
          promise: () => Promise.resolve(),
        } as any)
    );
    await expect(
      submit(userId, {
        projectId: 1,
        challengeId: 3,
        testUrl: 'http://example.com',
      })
    ).rejects.toThrow(
      "You don't have permission to access the provided Project Challenge."
    );
  });
});
