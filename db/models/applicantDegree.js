'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApplicantDegree = sequelize.define('ApplicantDegree', {}, {});
  ApplicantDegree.associate = function(models) {
    ApplicantDegree.belongsTo(models.Applicant);
    ApplicantDegree.belongsTo(models.Degree);
  };
  return ApplicantDegree;
};