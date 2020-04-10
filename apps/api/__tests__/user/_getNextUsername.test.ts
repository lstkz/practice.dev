import { _getNextUsername } from '../../src/contracts/user/_getNextUsername';
import { resetDb } from '../helper';
import { UserUsernameEntity } from '../../src/entities';

beforeEach(resetDb);

async function addUsername(username: string) {
  await new UserUsernameEntity({
    username,
    userId: '123',
  }).insert();
}

it('returns original username if it is not taken', async () => {
  const username = await _getNextUsername('foo');
  expect(username).toEqual('foo');
});

it('returns next username if taken', async () => {
  await addUsername('foo');
  await addUsername('foo-1');
  const username = await _getNextUsername('foo');
  expect(username).toEqual('foo-2');
});

it('should throw Exceeded limit', async () => {
  await addUsername('foo-48');
  await addUsername('foo-49');
  await addUsername('foo-50');
  await expect(_getNextUsername('foo', 48)).rejects.toThrow(
    'Cannot generate username. Exceeded limit.'
  );
});
