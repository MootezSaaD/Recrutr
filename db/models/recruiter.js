"use strict";
module.exports = (sequelize, DataTypes) => {
  const Recruiter = sequelize.define(
    "Recruiter",
    {
      userId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
    },
    {}
  );
  Recruiter.associate = function (models) {
    Recruiter.belongsTo(models.User);
    Recruiter.belongsTo(models.Company);
  };
  return Recruiter;
};
