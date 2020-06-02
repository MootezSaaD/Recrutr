const { Applicant } = require("../db/models");
const jobsService = require('../services/jobs.service')();
const skillsService = require('../services/skills.service')();

function applicantsService() {

  async function getJobApplications(user) {
    let applicant = await user.getApplicant();
    let applications = await applicant.getApplications();
    return applications;
  }

  async function addJobApplication(user, jobId) {
    let applicant = await user.getApplicant();
    let job = await jobsService.getJobById(jobId);
    await applicant.addJobOffer(job, {through: {status: "Pending"} });
  }

  async function getApplicantSkills(user) {
    let applicant = await user.getApplicant();
    let applicantSkills = await applicant.getApplicantSkills();
    return applicantSkills;
  }

  async function setSkills(user, skills) {
    let applicant = await user.getApplicant();
    let skillsArr = await skillsService.storeSkills(skills);
    await applicant.setSkills(skillsArr);
  }

  return {
    getJobApplications,
    addJobApplication,
    getApplicantSkills,
    setSkills
  };
}

module.exports = applicantsService;
