const { Applicant } = require("../db/models");

function applicantsService() {
  async function getJobApplications(user) {
    let applicant = await user.getApplicant();
    let applications = await applicant.getApplications();
    return applications;
  }
  
  return {
    getJobApplications,
  };
}

module.exports = applicantsService;
