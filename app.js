const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require('helmet');
const config = require('./config/env');
const passport = require("passport");

const app = express();

app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

const PORT = process.env.PORT || 3000;

// Temporary error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

// app.use('/api/', userRoute);

app.listen(PORT, () => {
  console.log("[X] Server is running");
});