'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApplicantSkill = sequelize.define('ApplicantSkill', {
    name: DataTypes.STRING
  }, {});
  ApplicantSkill.associate = function(models) {
    ApplicantSkill.belongsTo(models.Applicant);
    ApplicantSkill.belongsTo(models.Skill);
  };
  return ApplicantSkill;
};