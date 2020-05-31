const { JobOffer, Domain, Skill } = require('../db/models');
const recruitersService = require('../services/recruiters.service')();

function jobsService() {
  async function getJobById(id) {
    const query = { id: id };
    return JobOffer.findOne({ where: query });
  }

  async function getJobs() {
    return JobOffer.findAll();
  }

  async function deleteJobById(id) {
    const query = { id: id };
    return JobOffer.destroy({ where: query });
  }

  // Assuming domain is an object, this would be the correct syntax
  async function storeDomain(domainName) {
    [domain, created] = await Domain.findOrCreate({
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

  async function storeSkill(skill) {
    [skill, created] = await Skill.findOrCreate({
      where: { name: skill.name, type: skill.type },
      defaults: {
        name: skill.name,
        type: skill.type
      },
    });
    return skill;
  }

  async function storeSkills(skills) {
    let skillsArr = [];
    for (const skill of skills) {
      const result = await storeSkill(skill);
      skillsArr.push(result);
    }
    return skillsArr;
  }

  async function createJob(reqBody, user) {
    let recruiter = await recruitersService.getRecruiter(user.email);
    let company = await recruiter.getCompany();

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
    await jobOffer.setDomain(domain);
    await jobOffer.setCompany(company);

    // Creates and returns all created entries in an array
    // If the entry is already found, it is append to the array.
    let skillsArr = await storeSkills(reqBody.skills);

    // Method provided by sequelizer in case of a many-to-many relationship
    await jobOffer.setSkills(skillsArr);
  }

  return {
    getJobById,
    getJobs,
    deleteJobById,
    storeDomain,
    createJob,
    createJobOffer,
  };
}

module.exports = jobsService;
