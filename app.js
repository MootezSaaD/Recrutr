const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const usersRoutes = require('./routes/users');
const app = express();

app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Temporary error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

app.use('/api/user', usersRoutes);

module.exports = app;