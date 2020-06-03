const { Recruiter } = require('../db/models');
const stringSimilarity = require('string-similarity');

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

  function caculateYearsElapsed(startDate, endDate) {
    let timeElapsed = new Date(endDate - startDate);
    return Math.abs(timeElapsed / 31536000000);
 }

  const skillWeight = (skill) => {
    return {
      "required": 1.00,
      "optional": 0.50,
    }[skill];
  }

  const degreeWeight = (degreeType) => {
    return {
      "BSc": 0.25,
      "MSc": 0.50,
      "PhD": 0.75,
    }[degreeType];
  }

  async function computeWorkExperienceScore(applicantWorkExperiences, jobOfferDomain) {
    let score = 0;
    for (const applicantWorkExperience of applicantWorkExperiences) {
      let applicantWorkExperienceDomain = await applicantWorkExperience.getDomain();
      if (applicantWorkExperienceDomain.name === jobOfferDomain.name) {
        score += caculateYearsElapsed(applicantWorkExperience.startDate, applicantWorkExperience.endDate);
      }
    }
    return score;
  }

  /**
   * 
   * [{
   *    "id": 1,
   *    "name": "Python",
   *    "createdAt": "2020-06-03T06:41:41.000Z",
   *    "updatedAt": "2020-06-03T06:41:41.000Z",
   *    "JobOfferSkill": {
   *        "type": "Optional",
   *        "createdAt": "2020-06-03T04:43:17.000Z",
   *        "updatedAt": "2020-06-03T04:43:17.000Z",
   *        "JobOfferId": 1,
   *        "SkillId": 1
   *    }
   * }]
   */
  async function computeSkillScore(fullApplicantSkills, fullJobOfferSkills) {
    let score = 0;
    for (const fullApplicantSkill of fullApplicantSkills) {
      for (const fullJobOfferSkill of fullJobOfferSkills) {
        if (stringSimilarity.compareTwoStrings(fullJobOfferSkill.name, fullApplicantSkill.name) > 0.6) {
          let skillScore = skillWeight(fullJobOfferSkill.JobOfferSkill.type.toLowerCase());
          if (skillScore) {
            score += skillScore;
          }
        }
      }
    }
    return score;
  }

  async function computeDegreeScore(applicantDegrees, jobOfferDomain) {
    let score = 0;
    for (const applicantDegree of applicantDegrees) {
      let degreeDomain = await applicantDegree.getDomain();
      if (degreeDomain.name === jobOfferDomain.name) {
        let degreeScore = degreeWeight(applicantDegree.type);
        if (degreeScore) {
          score += degreeScore;
        }
      }
    }
    return score;
  }

  async function computeScores(jobOffers) {
    let scores = [];
    for (const jobOffer of jobOffers) {
      let applicationsScore = [];
      const applications = await jobOffer.getApplications();
      const jobOfferDomain = await jobOffer.getDomain();
      const fullJobOfferSkills = await jobOffer.getSkills();
      for (const application of applications) {
        let applicant = await application.getApplicant();
        let applicantDegrees = await applicant.getDegrees();
        let fullApplicantSkills = await applicant.getSkills();
        let applicantWorkExperiences = await applicant.getWorkExperiences();
        let degreeScore = await computeDegreeScore(applicantDegrees, jobOfferDomain);
        let skillScore = await computeSkillScore(fullApplicantSkills, fullJobOfferSkills);
        let workExperienceScore = await computeWorkExperienceScore(applicantWorkExperiences, jobOfferDomain);
        applicationsScore.push({
            jobOfferId: jobOffer.id,
            applicationId: applicant.id,
            score: (degreeScore * 0.4) + (skillScore * 0.2) + (workExperienceScore * 0.4), 
        });
      }
      scores.push(applicationsScore);
    }
    return scores;
  }

  return { 
    getRecruiter,
    getCompanyJobs,
    computeScores,
  };
}

module.exports = recruitersService;
