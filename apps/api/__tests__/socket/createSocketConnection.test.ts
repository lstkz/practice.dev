import { _getInvalidOrExpiredConnection } from '../../src/contracts/socket/createSocketConnection';
import { createKey } from '../../src/common/db';
import { DbSocketConnection } from '../../src/types';

const LIMIT = 5;

function createConnection(id: string, expireAt: number): DbSocketConnection {
  return {
    ...createKey({
      type: 'SOCKET_CONNECTION',
      connectionId: '1',
      userId: '1',
    }),
    connectionId: id,
    data_n: expireAt,
  };
}

describe('_getInvalidOrExpiredConnection', () => {
  it('missing data_n', () => {
    const connections = [
      createConnection('1', null!),
      createConnection('2', null!),
    ];
    const expired = _getInvalidOrExpiredConnection(connections, LIMIT);
    expect(expired).toEqual(connections);
  });

  it('all valid', () => {
    const now = Date.now();
    const connections = [
      createConnection('1', now - 2),
      createConnection('2', now - 1),
    ];
    const expired = _getInvalidOrExpiredConnection(connections, LIMIT);
    expect(expired).toEqual([]);
  });

  it('expired', () => {
    const now = Date.now();
    const connections = [
      createConnection('x1', 1),
      createConnection('x2', 2),
      createConnection('x3', now - 1),
    ];
    const expired = _getInvalidOrExpiredConnection(connections, LIMIT);
    expect(expired).toEqual([connections[0], connections[1]]);
  });

  it('over limit and expired', () => {
    const now = Date.now();
    const connections = [
      createConnection('x1', 1),
      // 1 is the oldest
      // 8 is the newest
      createConnection('1', now - 100),
      createConnection('4', now - 97),
      createConnection('5', now - 96),
      createConnection('6', now - 95),
      createConnection('2', now - 99),
      createConnection('7', now - 94),
      createConnection('3', now - 98),
      createConnection('8', now - 93),
    ];
    const expired = _getInvalidOrExpiredConnection(connections, LIMIT);
    expect(expired).toEqual([
      createConnection('x1', 1),
      createConnection('1', now - 100),
      createConnection('2', now - 99),
      createConnection('3', now - 98),
    ]);
  });
});
