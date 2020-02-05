import cdk = require('@aws-cdk/core');
import sns = require('@aws-cdk/aws-sns');

export class MainTopic {
  private topic: sns.Topic;

  constructor(scope: cdk.Construct) {
    this.topic = new sns.Topic(scope, 'MainTopic', {});

    new cdk.CfnOutput(scope, 'topicArn', {
      value: this.topic.topicArn,
    });
  }

  getSNSTopic() {
    return this.topic;
  }
}
