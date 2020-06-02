const { Domain } = require('../db/models');

function domainsService() {

  async function storeDomain(domainName) {
    [domain, created] = await Domain.findOrCreate({
      where: { name: domainName },
      defaults: {
        name: domainName,
      },
    });
    return domain;
  }

  return { storeDomain };
}

module.exports = domainsService;
