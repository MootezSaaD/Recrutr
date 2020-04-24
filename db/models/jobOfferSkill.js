"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobOfferSkill = sequelize.define(
    "JobOfferSkill",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {}
  );
  JobOfferSkill.associate = function (models) {
    JobOfferSkill.belongsTo(models.JobOffer);
    JobOfferSkill.belongsTo(models.Skill);
  };
  return Skill;
};
