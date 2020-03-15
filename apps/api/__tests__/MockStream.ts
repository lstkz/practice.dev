import { dynamodb, dynamoStream } from '../src/lib';
import { TABLE_NAME } from '../src/config';
import { handler } from '../src/lambda/dynamoStream';
import { DynamoDBStreams } from 'aws-sdk';

export class MockStream {
  private shardIterators: string[] | null = null;
  private shards?: DynamoDBStreams.ShardDescriptionList | null = null;
  private arn: string | null = null;

  async prepare() {
    const table = await dynamodb
      .describeTable({
        TableName: TABLE_NAME,
      })
      .promise()
      .then(x => x.Table!);

    this.arn = table.LatestStreamArn!;
    const ret = await dynamoStream
      .describeStream({
        StreamArn: this.arn,
      })
      .promise();
    this.shards = ret.StreamDescription!.Shards;
  }

  async init() {
    if (!this.shards) {
      await this.prepare();
    }

    this.shardIterators = [];

    await Promise.all(
      this.shards!.map(async shard => {
        const iterator = await dynamoStream
          .getShardIterator({
            ShardId: shard.ShardId!,
            StreamArn: this.arn!,
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
