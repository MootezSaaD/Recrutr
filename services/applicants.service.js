const { Applicant, Application, JobOffer } = require("../db/models");
const jobsService = require('../services/jobs.service')();
const domainsService = require('../services/domains.service')();
const skillsService = require('../services/skills.service')();

function applicantsService() {

  async function getApplicantById(applicantId) {
    let applicant = await Applicant.findByPk(applicantId);
    return applicant;
  }

  async function getApplicationByIds(applicantId, jobOfferId) {
    let application = await Application.findOne(
      { where : {
        ApplicantId: application.id,
        JobOfferId: jobOfferId,
      }}
    );
    return application;
  }

  async function updateApplicationStatus(application, status) {
    application.status = status;
    await application.save();
  }

  async function getJobOffers(user) {
    let applicant = await user.getApplicant();
    let applications = await applicant.getApplications();
    let applicationsArr = [];
    for(let application of applications) {
      let jobOffer = await JobOffer.findByPk(application.JobOfferId);
      let company = await jobOffer.getCompany();
      let domain = await jobOffer.getDomain();
      applicationsArr.push({
        title: jobOffer.title,
        company: company.name,
        description: jobOffer.description,
        status: application.status,
        applicationDate: application.createdAt
      })
    }
    return applicationsArr;
  }

  async function addJobApplication(user, jobId) {
    let applicant = await user.getApplicant();
    let job = await jobsService.getJobById(jobId);
    await applicant.addJobOffer(job, {through: {status: "Pending"} });
  }

  async function getApplicantSkills(user) {
    let applicant = await user.getApplicant();
    let applicantSkills = await applicant.getSkills();
    return applicantSkills;
  }

  async function setSkills(user, skills) {
    let applicant = await user.getApplicant();
    let skillsArr = await skillsService.storeSkills(skills);
    await applicant.setSkills(skillsArr);
  }


  async function getWorkExperiences(user) {
    let applicant = await user.getApplicant();
    let workExperience = await applicant.getWorkExperiences();
    return workExperience;
  }

  async function addWorkExperience(user, workExperience) {
    let applicant = await user.getApplicant();
    let domain = await domainsService.storeDomain(workExperience.domain);
    let applicantWorkExperience = await applicant.createWorkExperience({
      jobTitle: workExperience.jobTitle,
      companyName: workExperience.companyName,
      startDate: workExperience.startDate,
      endDate: workExperience.endDate,
    });
    await applicantWorkExperience.setDomain(domain);
  }

  async function getDegrees(user) {
    let applicant = await user.getApplicant();
    let applicantDegrees = await applicant.getDegrees();
    let degreesArr = [];
    for(let degree of applicantDegrees) {
      let degreeDomain = await degree.getDomain();
      console.log(degreeDomain);
      degreesArr.push({
        id: degree.id,
        applicantID: applicant.id,
        type: degree.type,
        domain: degreeDomain.name
      })
    }
    return degreesArr;
  }

  async function addDegree(user, degree) {
    let applicant = await user.getApplicant();
    let domain = await domainsService.storeDomain(degree.domain);
    await applicant.createDegree({
      type: degree.type,
      DomainId: domain.id,
    });
  }

  return {
    getApplicantById,
    getApplicationByIds,
    updateApplicationStatus,
    getJobOffers,
    addJobApplication,
    getApplicantSkills,
    setSkills,
    getWorkExperiences,
    addWorkExperience,
    getDegrees,
    addDegree
  };
}

module.exports = applicantsService;
