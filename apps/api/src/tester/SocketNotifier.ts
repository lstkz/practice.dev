import { Notifier } from 'tester';
import { SocketMessage } from 'shared';
import { SocketConnectionEntity } from '../entities2';

export class SocketNotifier implements Notifier {
  private lastNotify = 0;
  private pendingData: any[] = [];

  constructor(
    private api: AWS.ApiGatewayManagementApi,
    private connections: SocketConnectionEntity[]
  ) {}

  private async notifySocket(data: object, force = false) {
    if (!this.connections.length) {
      return;
    }
    if (!force && Date.now() - this.lastNotify < 500) {
      this.pendingData.push(data);
      return;
    }

    const combined = [
      ...this.pendingData,
      ...(Array.isArray(data) ? data : [data]),
    ];
    this.pendingData = [];

    await Promise.all(
      this.connections.map(async con => {
        try {
          await this.api
            .postToConnection({
              ConnectionId: con.connectionId,
              Data: JSON.stringify(combined),
            })
            .promise();
          this.lastNotify = Date.now();
        } catch (e) {
          console.error(e, 'Failed to post message to socket');
        }
      })
    );
  }

  async flush() {
    if (this.pendingData.length) {
      await this.notifySocket([], true);
    }
  }

  async notify(action: SocketMessage) {
    await this.notifySocket(action);
  }
}
