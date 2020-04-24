"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobOffer = sequelize.define(
    "JobOffer",
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {}
  );
  JobOffer.associate = function (models) {
    // associations can be defined here
    JobOffer.belongsToMany(models.Skill, { through: models.JobOfferSkill });
    JobOffer.hasMany(models.JobOfferSkill);
  };
  return JobOffer;
};
