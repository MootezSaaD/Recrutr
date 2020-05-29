const express = require("express");
const router = express.Router();
const passport = require("passport");
const jobsService = require("../services/jobs.service")();
const permit = require("../middlewares/permissions");

/**
 * Request Example : 
 * {
  "domain": "Software Engineering",
  "title": "Data Analyst",
  "description": "Loremp ipmsum",
  "startDate": "2020-01-12",
  "endDate": "2020-01-30",
  "skills": {
    "1": "Team Member",
    "2": "Statistics",
    "3": "Python"
  }
  skills object khater f postman bech tged array to93od 356668 aam...
*/
router.post(
  "/create",
  [passport.authenticate("jwt", { session: false }), permit('recruiter')],
  async (req, res, next) => {
    // Fetch the recruiter's info
    // First check the if caller is a recruiter
    try {
      await jobsService.createJob(req.body, req.user);
      res.send({ success: true });
    } catch(err) {
      res.status(401).send({
        success: false,
        message: err.msg,
      });
    }
  }
);

module.exports = router;