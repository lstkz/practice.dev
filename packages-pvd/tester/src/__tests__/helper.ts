import http from 'http';

export function getBody(req: http.IncomingMessage) {
  const body: any[] = [];
  return new Promise((resolve, reject) => {
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        const str = Buffer.concat(body).toString();
        try {
          resolve(JSON.parse(str));
        } catch (e) {
          reject(new Error('Invalid JSON'));
        }
      })
      .on('error', reject);
  });
}
