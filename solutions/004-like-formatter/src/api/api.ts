import express from 'express';

const app = express();

app.use(express.json());

var listener = app.listen(4001, function () {
  console.log('Listening on port 4001');
});
