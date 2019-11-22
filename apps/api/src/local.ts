import http from 'http';
import util from 'util';
import Path from 'path';
import { handler } from './handler';
import chokidar from 'chokidar';

const watcher = chokidar.watch(__dirname);

watcher.on('ready', function() {
  watcher.on('all', function() {
    console.log('Resetting cache');
    Object.keys(require.cache).forEach(function(id) {
      if (!id.includes('node_modules')) {
        delete require.cache[id];
      }
    });
  });
});

function _getBody(req: http.IncomingMessage) {
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

const server = http.createServer(async (req, res) => {
  try {
    const exec = /\/rpc\/(.+)/.exec(req.url!);
    if (!exec) {
      throw new Error('Invalid url');
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.end();
      return;
    }
    if (req.method !== 'POST') {
      throw new Error('Method must be POST');
    }
    const body = await _getBody(req);
    if (!Array.isArray(body)) {
      throw new Error('Request body must be an array');
    }
    const token = req.headers['x-token'];
    if (Array.isArray(token)) {
      throw new Error('x-token must not be an array');
    }

    const ret = await handler(exec[1], body, token);

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(ret || {}, null, 2));
    res.end();
  } catch (e) {
    const serialized = util.inspect(e, { depth: null });
    console.error(serialized);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.write(
      JSON.stringify(
        {
          ok: false,
          error: e.message,
          fullError: serialized.split('\n'),
        },
        null,
        2
      )
    );
    res.end();
  }
});

server.listen(3000, () => {
  console.log(`Listening on port 3000 in ${process.env.NODE_ENV} mode`);
});
