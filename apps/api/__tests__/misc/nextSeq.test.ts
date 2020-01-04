import * as R from 'remeda';
import { resetDb } from '../helper';
import { nexSeq } from '../../src/contracts/misc/nextSeq';

beforeEach(async () => {
  await resetDb();
});

it('make many parallel sequences', async () => {
  const foo: number[] = [];
  const bar: number[] = [];

  const expectedIds = R.range(1, 11);
  await Promise.all([
    ...expectedIds.map(() =>
      nexSeq('FOO').then(id => {
        foo.push(id);
      })
    ),
    ...expectedIds.map(() =>
      nexSeq('BAR').then(id => {
        bar.push(id);
      })
    ),
  ]);

  foo.sort((a, b) => a - b);
  bar.sort((a, b) => a - b);

  expect(foo).toEqual(expectedIds);
  expect(bar).toEqual(expectedIds);
});
