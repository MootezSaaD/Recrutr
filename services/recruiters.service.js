const { Recruiter, Company } = require('../db/models');

function recruitersService() {
  async function getRecruiter(email) {
    const query = { UserEmail: email };
    return Recruiter.findOne({ where: query });
  }

  async function getCompany(recruiterID) {
    const query = { id: recruiterID };
    return Company.findOne({ where: query });
  }
  return { getRecruiter, getCompany };
}

module.exports = recruitersService;
