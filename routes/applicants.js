const express = require("express");
const router = express.Router();
const passport = require("passport");
const applicantsService = require("../services/applicants.service")();
const { permit } = require("../middlewares/permissions");

router.get(
  "/jobs",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      let jobApplications = await applicantsService.getJobApplications(req.user);
      res.json(jobApplications);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not retrieve job applications",
      });
    }
  }
);

router.get(
  "/skills",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      let applicantSkills = await applicantsService.getApplicantSkills(req.user);
      res.json(applicantSkills);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not retrieve applicant skills",
      });
    }
  }
);

router.post(
  "/skills",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      await applicantsService.setSkills(req.user, req.body.skills);
      res.send({
        success: true,
        message: "Skills added to applicant",
      });
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not set applicant skills",
      });
    }
  }
);

module.exports = router;
