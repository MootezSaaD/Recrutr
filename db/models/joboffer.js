"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobOffer = sequelize.define(
    "JobOffer",
    {
      title: { 
        type: DataTypes.STRING,
        primaryKey: true,
      },
      description: DataTypes.STRING,
      startDate: {
        type: DataTypes.DATE,
        primaryKey: true,
      },
      endDate: {
        type: DataTypes.DATE,
        primaryKey: true,
      }
    },
    {}
  );
  JobOffer.associate = function (models) {
    JobOffer.belongsTo(models.Company);
    JobOffer.belongsTo(models.Domain);
    JobOffer.hasMany(models.Application);

    JobOffer.belongsToMany(models.Skill, { through: models.JobOfferSkill });
    JobOffer.hasMany(models.JobOfferSkill);
  };
  return JobOffer;
};
