const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/validate', (req, res) => {
  const { password } = req.body;
  let isValid = true;
  const special = ['!', '@', '#', '$'];
  if (
    password.length < 5 ||
    password[0] === ' ' ||
    password[password.length - 1] === ' ' ||
    special.every(c => !password.includes(c))
  ) {
    isValid = false;
  }

  res.json({ isValid });
});

app.listen(1234);
