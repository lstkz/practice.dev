import { Notifier } from '@pvd/tester';
import { SocketMessage } from 'shared';

export class MultiNotifier implements Notifier {
  constructor(private notifiers: Notifier[]) {}

  async flush() {
    await Promise.all(this.notifiers.map(notifier => notifier.flush()));
  }

  async notify(action: SocketMessage) {
    await Promise.all(this.notifiers.map(notifier => notifier.notify(action)));
  }
}
