const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("[X] Server is running");
});
