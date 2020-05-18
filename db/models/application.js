"use strict";
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "Application",
    {
      status: DataTypes.STRING,
      cv: DataTypes.STRING,
    },
    {}
  );
  Application.associate = function (models) {
    Application.belongsTo(models.Applicant, {
      foreignKey: {
        allowNull: false
      }
    });
    Application.belongsTo(models.JobOffer);
  };
  return Application;
};
