const express = require("express");
const router = express.Router();
const passport = require("passport");
const recruitersService = require("../services/recruiters.service")();
const hungarianService = require("../services/hungarian.service")();
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

router.get(
  "/jobs/applicant-suggestions",
  [passport.authenticate("jwt", { session: false }), permit('recruiter')],
  async (req, res, next) => {
    try {
      let jobOffers = await recruitersService.getCompanyJobs(req.user);
      let matrix = await hungarianService.runAlgorithm(jobOffers);
      res.json(matrix);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not get applicant suggestions",
      });
    }
  }
);

router.get(
  "/jobs/skills",
  [passport.authenticate("jwt", { session: false }), permit('recruiter')],
  async (req, res, next) => {
    try {
      let jobsOffers = await recruitersService.getCompanyJobs(req.user);
      res.json(await jobsOffers[0].getSkills());
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not ",
      });
    }
  }
);

module.exports = router;
