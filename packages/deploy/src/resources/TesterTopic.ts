import cdk = require('@aws-cdk/core');
import sns = require('@aws-cdk/aws-sns');

export class TesterTopic {
  private topic: sns.Topic;

  constructor(scope: cdk.Construct) {
    this.topic = new sns.Topic(scope, 'TesterTopic', {});

    new cdk.CfnOutput(scope, 'testerTopicArn', {
      value: this.topic.topicArn,
    });
  }

  getSNSTopic() {
    return this.topic;
  }
}
