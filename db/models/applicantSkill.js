'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApplicantSkill = sequelize.define('ApplicantSkill', {}, {});
  ApplicantSkill.associate = function(models) {
    ApplicantSkill.belongsTo(models.Applicant);
    ApplicantSkill.belongsTo(models.Skill);
  };
  return ApplicantSkill;
};