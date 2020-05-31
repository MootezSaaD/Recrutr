const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const applicantRoutes = require("./routes/applicants");
const recruiterRoutes = require("./routes/recruiters");
const domainRoutes = require("./routes/domains");
const skillRoutes = require("./routes/skills");

const app = express();

app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

// Temporary error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

app.use("/api/users", userRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/recruiters", recruiterRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/skills", skillRoutes);

module.exports = app;
