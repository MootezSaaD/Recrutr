"use strict";
module.exports = (sequelize, DataTypes) => {
  const Degree = sequelize.define(
    "Degree",
    {
      type: {
        type: DataTypes.ENUM("BSc", "MSc", "PhD"),
      },
    },
    {}
  );
  Degree.associate = function (models) {
    Degree.belongsToMany(models.Applicant, { through: models.ApplicantDegree });
    Degree.hasMany(models.ApplicantDegree);

    Degree.belongsTo(models.Domain);
  };
  return Degree;
};
