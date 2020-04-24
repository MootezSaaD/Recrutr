"use strict";
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {}
  );
  Skill.associate = function (models) {
    Skill.belongsToMany(models.JobOffer, { through: models.JobOfferSkill });
    Skill.hasMany(models.JobOfferSkill);

    Skill.belongsToMany(models.Applicant, { through: models.ApplicantSkill });
    Skill.hasMany(models.ApplicantSkill);
  };
  return Skill;
};
