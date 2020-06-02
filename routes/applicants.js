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
      let jobApplications = await applicantsService.getJobOffers(req.user);
      res.json(jobApplications);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not retrieve job application",
      });
    }
  }
);

router.put(
  "/jobs/:jobId",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      await applicantsService.addJobApplication(req.user, req.params.jobId);
      res.send({
        success: true,
        message: 'Application added to applicant',
      });
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not add applications",
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

router.get(
  "/work-experiences",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      let applicantWorkExperience = await applicantsService.getWorkExperiences(req.user);
      res.json(applicantWorkExperience);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not retrieve work experiences",
      });
    }
  }
);

router.post(
  "/work-experiences",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      await applicantsService.addWorkExperience(req.user, req.body);
      res.send({
        success: true,
        message: "Work experience added",
      });
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not add work experience",
      });
    }
  }
);


router.get(
  "/degrees",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      let applicantDegrees = await applicantsService.getDegrees(req.user);
      res.json(applicantDegrees);
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not retrieve degrees",
      });
    }
  }
);

router.post(
  "/degree",
  [passport.authenticate("jwt", { session: false }), permit('applicant')],
  async (req, res, next) => {
    try {
      await applicantsService.addDegree(req.user, req.body);
      res.send({
        success: true,
        message: "Degree added",
      });
    } catch(err) {
      res.status(500).send({
        success: false,
        message: "Could not add degree",
      });
    }
  }
);

module.exports = router;
