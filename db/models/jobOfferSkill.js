"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobOfferSkill = sequelize.define(
    "JobOfferSkill",
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      } 
    },
    {},
  );
  JobOfferSkill.associate = function (models) {
    JobOfferSkill.belongsTo(models.JobOffer);
    JobOfferSkill.belongsTo(models.Skill);
  };
  return JobOfferSkill;
};
