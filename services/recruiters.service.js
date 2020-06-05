const { Recruiter } = require('../db/models');

function recruitersService() {
  async function getRecruiter(email) {
    const query = { UserEmail: email };
    return Recruiter.findOne({ where: query });
  }

  async function getCompanyJobs(user) {
    let recruiter = await user.getRecruiter();
    let company = await recruiter.getCompany();
    let jobsOffers = await company.getJobOffers();
    let finalJobOffers = [];
    for (let jobOffer of jobsOffers) {
      let jobDomain = await jobOffer.getDomain();
      let jobCompany = await jobOffer.getCompany();
      let jobOfferSkills = await jobOffer.getJobOfferSkills();
      let skillsArr = [];
      for (let jobOfferSkill of jobOfferSkills) {
        let s = await jobOfferSkill.getSkill().then((skill) => skill.toJSON());
        delete s.createdAt;
        delete s.updatedAt;
        skillsArr.push({ name: s.name, type: jobOfferSkill.type });
      }
      finalJobOffers.push(
        Object.assign(jobOffer.toJSON(), {
          skills: skillsArr,
          company: jobCompany.name,
          domain: jobDomain.name,
        })
      );
    }

    return finalJobOffers;
  }
  return {
    getRecruiter,
    getCompanyJobs,
  };
}

module.exports = recruitersService;
