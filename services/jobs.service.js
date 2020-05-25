const { JobOffer, Domain } = require("../db/models");

function jobsService() {
  async function createDomain(name) {
    return Domain.create(name);
  }
  return { createDomain };
}

module.exports = jobsService;
