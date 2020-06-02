'use strict';
module.exports = (sequelize, DataTypes) => {
  const Domain = sequelize.define('Domain', {
    name: DataTypes.STRING
  }, {});
  Domain.associate = function(models) {
    Domain.hasOne(models.JobOffer);
    Domain.hasOne(models.WorkExperience);

    Domain.hasMany(models.Degree);
  };
  return Domain;
};