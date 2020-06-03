const { Recruiter } = require('../db/models');

function recruitersService() {
  async function getRecruiter(email) {
    const query = { UserEmail: email };
    return Recruiter.findOne({ where: query });
  }

  async function getCompanyJobs(user) {
    let recruiter = await user.getRecruiter();
    let company = await recruiter.getCompany();
    let jobOffers = await company.getJobOffers();
    return jobOffers;
  }
  return { 
    getRecruiter,
    getCompanyJobs,
  };
}

module.exports = recruitersService;
