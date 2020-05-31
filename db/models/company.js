'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    sector: DataTypes.STRING
  }, {});
  Company.associate = function(models) {
    Company.hasMany(models.Recruiter);
    Company.hasMany(models.JobOffer);
  };
  return Company;
};