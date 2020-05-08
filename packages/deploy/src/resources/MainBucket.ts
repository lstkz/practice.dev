import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');

export class MainBucket {
  private bucket: s3.Bucket;

  constructor(scope: cdk.Construct) {
    this.bucket = new s3.Bucket(scope, 'Bucket', {
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [s3.HttpMethods.POST],
        },
      ],
    });

    new cdk.CfnOutput(scope, 'bucketName', {
      value: this.bucket.bucketName,
    });
  }

  getS3Bucket() {
    return this.bucket;
  }
}
