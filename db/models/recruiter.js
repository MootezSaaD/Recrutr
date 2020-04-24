"use strict";
module.exports = (sequelize, DataTypes) => {
  const Recruiter = sequelize.define(
    "Recruiter",
    {},
    {}
  );
  Recruiter.associate = function (models) {
    Recruiter.belongsTo(models.User);
    Recruiter.belongsTo(models.Company);
  };
  return Recruiter;
};
