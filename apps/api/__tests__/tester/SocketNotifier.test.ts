import { SocketNotifier } from '../../src/tester/SocketNotifier';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { SocketMessage } from 'shared';
import { SocketConnectionEntity } from '../../src/entities';

let connections: SocketConnectionEntity[] = [];
let api: {
  postToConnection: jest.Mock<
    {
      promise: () => Promise<void>;
    },
    [ApiGatewayManagementApi.PostToConnectionRequest]
  >;
} = null!;

let now: jest.SpyInstance<number, []> = null!;

function getConnection(id: string) {
  return {
    connectionId: id,
  } as SocketConnectionEntity;
}

beforeEach(() => {
  connections = [getConnection('c1')];
  api = {
    postToConnection: jest.fn(_ => ({
      promise: () => Promise.resolve(),
    })),
  };

  now = jest.spyOn(Date, 'now');
  now.mockReturnValue(new Date(2000, 1, 1).getTime());
});

function createNotifier() {
  return new SocketNotifier(api as any, connections);
}

function getMsg(nr: number): SocketMessage {
  return {
    type: 'STARTING_TEST',
    meta: { id: 'mock' },
    payload: { testId: nr },
  };
}

function assertInvokes(...nr: number[]) {
  expect(api.postToConnection).toHaveBeenCalledWith({
    ConnectionId: 'c1',
    Data: JSON.stringify(nr.map(getMsg)),
  });
}

it('empty connections', async () => {
  connections = [];
  const notifier = createNotifier();
  await notifier.notify(getMsg(1));
  await notifier.flush();
  expect(api.postToConnection).not.toHaveBeenCalled();
});

it('first message should be send immediately', async () => {
  const notifier = createNotifier();
  const msg = getMsg(1);
  await notifier.notify(msg);
  expect(api.postToConnection).toHaveBeenCalledWith({
    ConnectionId: 'c1',
    Data: JSON.stringify([msg]),
  });
});

it('invoke multiple connections', async () => {
  connections = [getConnection('c1'), getConnection('c2')];
  const notifier = createNotifier();
  const msg = getMsg(1);
  await notifier.notify(msg);
  expect(api.postToConnection).toHaveBeenCalledWith({
    ConnectionId: 'c1',
    Data: JSON.stringify([msg]),
  });
  expect(api.postToConnection).toHaveBeenCalledWith({
    ConnectionId: 'c2',
    Data: JSON.stringify([msg]),
  });
});

it('second msg should be queued and send after flush', async () => {
  const notifier = createNotifier();
  const msg1 = getMsg(1);
  const msg2 = getMsg(2);
  await notifier.notify(msg1);
  await notifier.notify(msg2);
  assertInvokes(1);
  api.postToConnection.mockClear();
  await notifier.flush();
  assertInvokes(2);
});

it('second msg should be not be queued if 500ms elapsed', async () => {
  const notifier = createNotifier();
  const msg1 = getMsg(1);
  const msg2 = getMsg(2);
  await notifier.notify(msg1);
  now.mockReturnValue(new Date(3000, 0, 0).getTime());
  await notifier.notify(msg2);
  assertInvokes(1);
  assertInvokes(2);
});

it('queue multiple messages and flush', async () => {
  const notifier = createNotifier();
  await notifier.notify(getMsg(1));
  assertInvokes(1);
  api.postToConnection.mockClear();
  await notifier.notify(getMsg(2));
  await notifier.notify(getMsg(3));
  await notifier.notify(getMsg(4));
  await notifier.flush();
  assertInvokes(2, 3, 4);
});

it('queue multiple messages flush if 500 elapsed', async () => {
  const notifier = createNotifier();
  await notifier.notify(getMsg(1));
  assertInvokes(1);
  api.postToConnection.mockClear();
  await notifier.notify(getMsg(2));
  await notifier.notify(getMsg(3));
  now.mockReturnValue(new Date(3000, 0, 0).getTime());
  await notifier.notify(getMsg(4));
  assertInvokes(2, 3, 4);
});
