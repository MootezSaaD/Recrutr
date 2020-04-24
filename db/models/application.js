"use strict";
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "Application",
    {
      applicantId: DataTypes.INTEGER,
      jobId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      cv: DataTypes.STRING,
    },
    {}
  );
  Application.associate = function (models) {
    // associations can be defined here
  };
  return Application;
};