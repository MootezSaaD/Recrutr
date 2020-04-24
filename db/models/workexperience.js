"use strict";
module.exports = (sequelize, DataTypes) => {
  const WorkExperience = sequelize.define(
    "WorkExperience",
    {
      userId: DataTypes.INTEGER,
      domainId: DataTypes.INTEGER,
      jobTitle: DataTypes.STRING,
      companyName: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {}
  );
  WorkExperience.associate = function (models) {
    // associations can be defined here
  };
  return WorkExperience;
};
