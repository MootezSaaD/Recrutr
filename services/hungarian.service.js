const munkres = require('munkres-js');
const stringSimilarity = require('string-similarity');
const jobsService = require('../services/jobs.service')();
const applicantsService = require('../services/applicants.service')();
const usersService = require('../services/users.service')();

function hungarianService() {
  function caculateYearsElapsed(startDate, endDate) {
    let timeElapsed = new Date(endDate - startDate);
    return Math.abs(timeElapsed / 31536000000);
  }

  const skillWeight = (skill) => {
    return {
      required: 1.0,
      optional: 0.5,
    }[skill];
  };

  const degreeWeight = (degreeType) => {
    return {
      BSc: 0.25,
      MSc: 0.5,
      PhD: 0.75,
    }[degreeType];
  };

  async function computeWorkExperienceScore(
    applicantWorkExperiences,
    jobOfferDomain
  ) {
    let score = 0;
    for (const applicantWorkExperience of applicantWorkExperiences) {
      let applicantWorkExperienceDomain = await applicantWorkExperience.getDomain();
      if (applicantWorkExperienceDomain.name === jobOfferDomain.name) {
        score += caculateYearsElapsed(
          applicantWorkExperience.startDate,
          applicantWorkExperience.endDate
        );
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
        if (
          stringSimilarity.compareTwoStrings(
            fullJobOfferSkill.name,
            fullApplicantSkill.name
          ) > 0.6
        ) {
          let skillScore = skillWeight(
            fullJobOfferSkill.JobOfferSkill.type.toLowerCase()
          );
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
    let jobOfferIDs = [];
    let applicantIDs = [];
    for (const jobOffer of jobOffers) {
      const applications = await jobOffer.getApplications();
      const jobOfferDomain = await jobOffer.getDomain();
      const fullJobOfferSkills = await jobOffer.getSkills();
      for (const application of applications) {
        let applicant = await application.getApplicant();
        let applicantDegrees = await applicant.getDegrees();
        let fullApplicantSkills = await applicant.getSkills();
        let applicantWorkExperiences = await applicant.getWorkExperiences();
        let degreeScore = await computeDegreeScore(
          applicantDegrees,
          jobOfferDomain
        );
        let skillScore = await computeSkillScore(
          fullApplicantSkills,
          fullJobOfferSkills
        );
        let workExperienceScore = await computeWorkExperienceScore(
          applicantWorkExperiences,
          jobOfferDomain
        );
        scores.push({
          jobOfferId: jobOffer.id,
          applicantId: applicant.id,
          value:
            degreeScore * 0.4 + skillScore * 0.2 + workExperienceScore * 0.4,
        });
        if (!applicantIDs.includes(applicant.id)) {
          applicantIDs.push(applicant.id);
        }
      }
      jobOfferIDs.push(jobOffer.id);
    }
    return { jobOfferIDs, applicantIDs, scores };
  }

  async function generateHungarianMatrix(jobOfferIDs, applicantIDs, scores) {
    let matrix = new Array(applicantIDs.length);
    for (let i = 0; i < applicantIDs.length; i++) {
      matrix[i] = new Array(jobOfferIDs.length);
    }

    for (let i = 0; i < applicantIDs.length; i++) {
      for (let j = 0; j < jobOfferIDs.length; j++) {
        for (let score of scores) {
          matrix[i][j] = Infinity;
          if (
            jobOfferIDs[j] === score.jobOfferId &&
            applicantIDs[i] === score.applicantId
          ) {
            if (score.value === 0) {
              matrix[i][j] = Infinity;
            } else {
              matrix[i][j] = 1 / score.value;
            }
            break;
          }
        }
      }
    }
    return matrix;
  }

  async function runAlgorithm(jobOffers) {
    let { jobOfferIDs, applicantIDs, scores } = await computeScores(jobOffers);
    let matrix = await generateHungarianMatrix(
      jobOfferIDs,
      applicantIDs,
      scores
    );
    let hungarian_matrix = munkres(matrix);

    let matchings = [];
    for (match of hungarian_matrix) {
      let applicantId = applicantIDs[match[0]];
      let jobOfferId = jobOfferIDs[match[1]];
      let applicant = (
        await applicantsService.getApplicantById(applicantId)
      ).toJSON();
      applicant.info = (
        await usersService.getUserByEmail(applicant.UserEmail)
      ).toJSON();
      delete applicant.info.password;
      applicant.jobOffer = (await jobsService.getJobById(jobOfferId)).toJSON();
      matchings.push({
        firstName: applicant.info.firstName,
        lastName: applicant.info.lastName,
        email: applicant.UserEmail,
        phoneNumber: applicant.phoneNumber,
        jobTitle: applicant.jobOffer.title,
        jobDescription: applicant.jobOffer.description,
        jobStartDate: applicant.jobOffer.startDate,
        jobEndDate: applicant.jobOffer.endDate,
      });
    }
    return matchings;
  }

  return {
    runAlgorithm,
  };
}

module.exports = hungarianService;
