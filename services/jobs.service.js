const { JobOffer, Domain, Skill } = require('../db/models');
const recruitersService = require('../services/recruiters.service')();

function jobsService() {
  async function storeDomain(domainName) {
    const [domain, created] = await Domain.findOrCreate({
      where: { name: domainName },
      defaults: {
        name: domainName,
      },
    });
    return domain;
  }
  async function createJobOffer(jobOffer) {
    return JobOffer.create(jobOffer);
  }

  async function createSkills(skillsArr) {
    // Returns an array of the created skills
  }

  async function createJob(reqBody, user) {
    let recruiter = await recruitersService.getRecruiter(user.email);
    let company = await recruitersService.getCompany(recruiter.CompanyId);
    let payload = reqBody;
    let skills = [];
    // Skills are recevied as an object
    // transform it to array
    Object.values(payload.skills).forEach((skill) => {
      skills.push(skill);
    });
    delete payload.skils;
    payload.skills = skills;
    // Create domain (didn't use the special method between models since I don't how it handles duplicates)
    let domain = await storeDomain(reqBody.domain);
    // Create job offer
    let jobOffer = await createJobOffer({
      title: reqBody.title,
      description: reqBody.description,
      startDate: reqBody.startDate,
      endDate: reqBody.endDate,
    });
    // Set the job offer's domain and company
    jobOffer.setDomain(domain);
    jobOffer.setCompany(company);
    // Set the job skills
  }

  return {
    storeDomain,
    createJob,
    createJobOffer,
  };
}

module.exports = jobsService;
