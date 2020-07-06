import express from 'express';

const app = express();

app.use(express.json());

let note = 'aabb';

app.use((req, res, next) => {
  setTimeout(next, 300);
});

app.post('/api/note', (req, res) => {
  note = req.body.note;
  res.end();
});

app.get('/api/note', (req, res) => {
  res.json({ note });
});

var listener = app.listen(4001, function () {
  console.log('Listening on port 4001');
});
