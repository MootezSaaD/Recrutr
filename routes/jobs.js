const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserService = require("../services/users.service")();
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    // Fetch the recruiter's info
    const recruiter = await UserService.getUserByEmail(req.user);
    res.status(200).send({
      sucess: true,
    });
  }
);

module.exports = router;
