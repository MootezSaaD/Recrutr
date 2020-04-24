"use strict";
module.exports = (sequelize, DataTypes) => {
  const WorkExperience = sequelize.define(
    "WorkExperience",
    {
      jobTitle: DataTypes.STRING,
      companyName: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {}
  );
  WorkExperience.associate = function (models) {
    WorkExperience.belongsTo(models.Domain);
  };
  return WorkExperience;
};
