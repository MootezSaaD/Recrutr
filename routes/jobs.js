const express = require("express");
const router = express.Router();
const passport = require("passport");
const jobsService = require("../services/jobs.service")();
const { permit, isCompanyRecruiter } = require("../middlewares/permissions");

/**
 * Request Example: 
 * {
 *  "domain": "Software Engineering",
 *  "title": "Data Analyst",
 *  "description": "Loremp ipmsum",
 *  "startDate": "2020-01-12",
 *  "endDate": "2020-01-30",
 *  "skills": {
 *    "1": "Team Member",
 *    "2": "Statistics",
 *    "3": "Python"
 * }
*/
router.post(
  "/create",
  [passport.authenticate("jwt", { session: false }), permit('recruiter')],
  async (req, res, next) => {
    try {
      await jobsService.createJob(req.body, req.user);
      res.send({ success: true });
    } catch(err) {
      res.status(401).send({
        success: false,
        message: "Could not create job offer",
      });
    }
  }
);

router.delete(
  "/:jobId",
  [passport.authenticate("jwt", { session: false }), permit('recruiter'), isCompanyRecruiter],
  async (req, res, next) => {
    try {
      await jobsService.deleteJobById(req.params.jobId);
      res.send({ success: true });
    } catch(err) {
      res.status(401).send({
        success: false,
        message: "Could not delete job offer",
      });
    }
  }
);

module.exports = router;