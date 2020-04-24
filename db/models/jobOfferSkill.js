"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobOfferSkill = sequelize.define(
    "JobOfferSkill",
    {},
    {},
  );
  JobOfferSkill.associate = function (models) {
    JobOfferSkill.belongsTo(models.JobOffer);
    JobOfferSkill.belongsTo(models.Skill);
  };
  return Skill;
};
