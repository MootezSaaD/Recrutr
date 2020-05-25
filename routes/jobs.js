const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersService = require("../services/users.service")();
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    /**
       * Request Example : 
       * {
	"domain": "Software Engineering",
	"title": "Data Analyst",
	"description": "Loremp ipmsum",
	"startDate": "2020-01-12",
	"endAte": "2020-01-30",
	"skills": {
		"1": "Team Member",
		"2": "Statistics",
		"3": "Python"
	}

}
skills object khater f postman bech tged array to93od 356668 aam...
       */
    // Fetch the recruiter's info
    // First check the if caller is a recruiter
    const role = await usersService.getRole(req.user.email);
    if (role.toLowerCase() === "recruiter") {
      let payload = req.body;
      let skills = [];
      // Skills are recevied as an object
      // transform it to array
      Object.values(payload.skills).forEach((skill) => {
        skills.push(skill);
      });
      delete payload.skils;
      payload.skills = skills;
      // Save job skills in the db using findOrCreate() #https://sequelize.org/master/manual/model-querying-finders.html
      // so if a skill is already stored in db , it won't add it, could be used also for the "domain", since many
      // job offers can belong to the same domain

      //Now get the recruiter's company

      //Finish by inserting every thing in the db.
      // wassalem (normalement..)
      res.status(200).send({
        success: true,
      });
    } else {
      res.status(401).send({
        success: false,
        message: "Recruiters zone only !",
      });
    }
  }
);

module.exports = router;
