"use strict";
module.exports = (sequelize, DataTypes) => {
  const Applicant = sequelize.define(
    "Applicant",
    {
      phoneNumber: DataTypes.STRING,
    },
    {}
  );
  Applicant.associate = function (models) {
    Applicant.belongsTo(models.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
    
    Applicant.belongsToMany(models.JobOffer, { through: models.Application });
    Applicant.hasMany(models.Application);

    Applicant.hasMany(models.WorkExperience);

    Applicant.belongsToMany(models.Skill, { through: models.ApplicantSkill });
    Applicant.hasMany(models.ApplicantSkill);

    Applicant.belongsToMany(models.Degree, { through: models.ApplicantDegree });
    Applicant.hasMany(models.ApplicantDegree);
  };
  return Applicant;
};
