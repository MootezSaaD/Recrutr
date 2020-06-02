const { JobOffer, Domain } = require('../db/models');
const skillsService = require('../services/skills.service')();
const recruitersService = require('../services/recruiters.service')();

function jobsService() {
  async function getJobById(id) {
    const query = { id: id };
    return JobOffer.findOne({ where: query });
  }

  async function getJobs() {
    let jobsOffers = await JobOffer.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    let finalJobOffers = [];
    for(let jobOffer of jobsOffers) {
      let jobDomain = await jobOffer.getDomain();
      let jobCompany = await jobOffer.getCompany();
      let jobOfferSkills = await jobOffer.getJobOfferSkills();
      let skillsArr = [];
      for(let jobOfferSkill of jobOfferSkills) {
        let s = await jobOfferSkill.getSkill().then(skill => skill.toJSON());
        delete s.createdAt;
        delete s.updatedAt;
        skillsArr.push(s)
      }
      finalJobOffers.push(
        Object.assign(jobOffer.toJSON(), {
          skills: skillsArr,
          company: jobDomain.name,
          domain: jobCompany.name,
        })
      );
    }

    return finalJobOffers;
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

    for (const skill of reqBody.skills) {
      let storedSkill = await skillsService.storeSkill(skill);
      await jobOffer.addSkill(storedSkill, { through: {type: skill.type} });
    }
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
