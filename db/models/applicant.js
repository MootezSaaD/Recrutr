"use strict";
module.exports = (sequelize, DataTypes) => {
  const Applicant = sequelize.define(
    "Applicant",
    {
      userId: DataTypes.INTEGER,
      degreeId: DataTypes.INTEGER,
      applicationId: DataTypes.INTEGER,
      phoneNumber: DataTypes.STRING,
    },
    {}
  );
  Applicant.associate = function (models) {
    // associations can be defined here
  };
  return Applicant;
};
