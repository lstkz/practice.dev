import zlib from 'zlib';
import { CloudWatchLogsEvent, CloudWatchLogsDecodedData } from '../types';
import { ses } from '../lib';
import { EMAIL_SENDER } from '../config';

export async function logHandler(event: CloudWatchLogsEvent) {
  if (!process.env.REPORT_ERROR_EMAIL) {
    throw new Error('REPORT_ERROR_EMAIL is not set');
  }
  const payload = Buffer.from(event.awslogs.data, 'base64');
  const parsed: CloudWatchLogsDecodedData = JSON.parse(
    zlib.gunzipSync(payload).toString('utf8')
  );
  const sourceName = parsed.logGroup.includes('tester') ? 'Tester' : 'API';

  await ses
    .sendEmail({
      Source: EMAIL_SENDER,
      Destination: {
        ToAddresses: [process.env.REPORT_ERROR_EMAIL],
      },
      Message: {
        Subject: {
          Data: `${sourceName} Error report`,
        },
        Body: {
          Text: {
            Data: parsed.logEvents
              .map(item => item.message)
              .join('\n\n--------------------------------\n\n'),
          },
        },
      },
    })
    .promise();
}
