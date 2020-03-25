import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type SocketConnectionProps = PropsOnly<SocketConnectionEntity>;

export type SocketConnectionKey = {
  connectionId: string;
  userId: string;
};

/**
 * Represents a socket connection.
 */
export class SocketConnectionEntity extends BaseEntity {
  connectionId!: string;
  userId!: string;
  createdAt!: number;

  constructor(values: SocketConnectionProps) {
    super(values, {
      createdAt: 'data_n',
    });
  }

  get key() {
    return SocketConnectionEntity.createKey(this);
  }

  static createKey({ connectionId, userId }: SocketConnectionKey) {
    return {
      pk: `SOCKET_CONNECTION:${connectionId}`,
      sk: `SOCKET_CONNECTION:${userId}`,
    };
  }
}
