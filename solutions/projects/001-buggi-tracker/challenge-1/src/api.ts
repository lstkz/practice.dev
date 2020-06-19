import express from 'express';
import http from 'http';

const app = express();

app.get('/ping', (req, res) => {
  res.json({
    pong: 2,
  });
});

app.listen();

http.createServer(app).listen(4001, () => {
  console.log('listening on 4001');
});
