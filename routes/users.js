const express = require("express");
const router = express.Router();
const passport = require("passport");
const UsersService = require("../services/users.service")();

router.post("/register", async (req, res, next) => {
  const resBody = req.body;
  try {
    await UsersService.register(resBody);
    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to register" });
  }
});

router.post("/authenticate", async (req, res, next) => {
  const resBody = req.body;
  try {
    const { user } = await UsersService.login(resBody);
    res.json(user);
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to login" });
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const tokens = await UsersService.refreshToken(req.body.refreshToken);
    res.json(tokens);
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to refresh token" });
  }
});

router.get("/@me",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = await UsersService.getProfile(req.user);
      res.json(user);
    } catch (err) {
      res.status(400).json({ success: false, message: "Failed to retrieve user profile" });
    }
  }
);


module.exports = router;
