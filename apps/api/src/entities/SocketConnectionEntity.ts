import { createBaseEntity } from '../lib';

export interface SocketConnectionKey {
  connectionId: string;
  userId: string;
}

export interface SocketConnectionProps extends SocketConnectionKey {
  createdAt: number;
}

const BaseEntity = createBaseEntity()
  .props<SocketConnectionProps>()
  .key<SocketConnectionKey>(key => ({
    pk: `SOCKET_CONNECTION:${key.connectionId}`,
    sk: `SOCKET_CONNECTION:${key.userId}`,
  }))
  .mapping({
    createdAt: 'data_n',
  })
  .build();

export class SocketConnectionEntity extends BaseEntity {
  static async getAllUserConnections(userId: string) {
    const { sk } = this.createKey({
      connectionId: '-1',
      userId,
    });
    return this.queryAll({
      key: {
        sk,
        data_n: null,
      },
    });
  }

  static async getByIdOrNull(id: string) {
    const { pk } = SocketConnectionEntity.createKey({
      connectionId: id,
      userId: '-1',
    });
    const items = await this.queryAll({
      key: { pk },
    });
    return items.length ? items[0] : null;
  }
}
