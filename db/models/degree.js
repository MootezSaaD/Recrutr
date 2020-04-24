"use strict";
module.exports = (sequelize, DataTypes) => {
  const Degree = sequelize.define(
    "Degree",
    {
      type: {
        type: DataTypes.ENUM,
        values: ["Bsc", "MSc", "PhD"], // Take a look at the migration (I dunno if we should add the values to it also)
      },
    },
    {}
  );
  Degree.associate = function (models) {
    Degree.belongsToMany(models.Applicant, { through: models.ApplicantDegree });
    Degree.hasMany(models.ApplicantDegree);
  };
  return Degree;
};
