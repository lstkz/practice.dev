import { createSocketConnection } from '../contracts/socket/createSocketConnection';
import { getUserByToken } from '../contracts/user/getUserByToken';
import { deleteSocketConnection } from '../contracts/socket/deleteSocketConnection';
import { APIGatewayProxyEvent } from '../types';

export async function socketHandler(event: APIGatewayProxyEvent) {
  const { connectionId } = event.requestContext;
  if (!connectionId) {
    throw new Error('"connectionId" is not defined in requestContext');
  }

  switch (event.requestContext.eventType) {
    case 'CONNECT': {
      const { token } =
        event.queryStringParameters || ({} as Record<string, string>);
      if (!token) {
        throw new Error('"token" is missing in query string');
      }
      const user = await getUserByToken(token);
      if (!user) {
        throw new Error('invalid or expired token');
      }
      await createSocketConnection(user.id, connectionId);
      break;
    }
    case 'DISCONNECT': {
      await deleteSocketConnection(connectionId);
      break;
    }
  }
  return { statusCode: 200, body: 'ok' };
}
