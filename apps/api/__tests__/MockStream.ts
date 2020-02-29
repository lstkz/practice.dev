import { dynamodb, dynamoStream } from '../src/lib';
import { TABLE_NAME } from '../src/config';
import { handler } from '../src/lambda/dynamoStream';

export class MockStream {
  private shardIterators: string[] | null = null;

  async init() {
    const table = await dynamodb
      .describeTable({
        TableName: TABLE_NAME,
      })
      .promise()
      .then(x => x.Table!);

    const arn = table.LatestStreamArn!;
    const ret = await dynamoStream
      .describeStream({
        StreamArn: arn,
      })
      .promise();
    this.shardIterators = [];

    await Promise.all(
      ret.StreamDescription!.Shards!.map(async shard => {
        const iterator = await dynamoStream
          .getShardIterator({
            ShardId: shard.ShardId!,
            StreamArn: arn,
            ShardIteratorType: 'LATEST',
          })
          .promise();
        if (iterator.ShardIterator) {
          this.shardIterators!.push(iterator.ShardIterator);
        }
      })
    );
  }

  async process() {
    if (!this.shardIterators) {
      throw new Error('shardIterators not set');
    }
    const nextIterators = await Promise.all(
      this.shardIterators.map(async iterator => {
        const result = await dynamoStream
          .getRecords({
            ShardIterator: iterator,
          })
          .promise();
        if (result.Records?.length) {
          await handler({
            Records: result.Records as any,
          });
        }
        return result.NextShardIterator!;
      })
    );
    this.shardIterators = nextIterators.filter(x => x);
  }
}
