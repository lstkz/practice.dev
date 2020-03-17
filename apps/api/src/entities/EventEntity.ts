import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';
import { Put } from 'aws-sdk/clients/dynamodb';

export type EventProps = PropsOnly<EventEntity>;

export type EventKey = {
  eventId: string;
};

/**
 * Represents a processed event from dynamodb or other source.
 */
export class EventEntity extends BaseEntity {
  eventId!: string;

  constructor(values: EventProps) {
    super(values);
  }

  get key() {
    return EventEntity.createKey(this);
  }

  static createKey({ eventId }: EventKey) {
    const pk = `EVENT:${eventId.toLowerCase()}`;
    return {
      pk,
      sk: pk,
    };
  }

  static getEventConditionPutItem(eventId: string): Put {
    const entity = new EventEntity({ eventId });
    return {
      ConditionExpression: 'attribute_not_exists(pk)',
      ...entity.preparePut(),
    };
  }
}
