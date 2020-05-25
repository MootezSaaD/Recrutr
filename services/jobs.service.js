const { JobOffer, Domain } = require("../db/models");

function jobsService() {
  async function createDomain(name) {
    return Domain.create(name);
  }

  async function createJob(reqBody) {
    let payload = req.body;
    let skills = [];
    // Skills are recevied as an object
    // transform it to array
    Object.values(payload.skills).forEach((skill) => {
      skills.push(skill);
    });
    delete payload.skils;
    payload.skills = skills;
    // Save job skills in the db using findOrCreate() #https://sequelize.org/master/manual/model-querying-finders.html
    // so if a skill is already stored in db , it won't add it, could be used also for the "domain", since many
    // job offers can belong to the same domain

    //Now get the recruiter's company

    //Finish by inserting every thing in the db.
    // wassalem (normalement..)
  }
  
  return { 
    createDomain,
    createJob
  };
}

module.exports = jobsService;
