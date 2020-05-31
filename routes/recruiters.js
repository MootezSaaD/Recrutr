const express = require("express");
const router = express.Router();
const passport = require("passport");
const recruitersService = require("../services/recruiters.service")();
const { permit } = require("../middlewares/permissions");

router.get(
  "/jobs",
  [passport.authenticate("jwt", { session: false }), permit('recruiter')],
  async (req, res, next) => {
    try {
      let jobOffers = await recruitersService.getCompanyJobs(req.user);
      res.json(jobOffers);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not retrieve company job offers",
      });
    }
  }
);

module.exports = router;
