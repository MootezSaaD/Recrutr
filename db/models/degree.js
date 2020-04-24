"use strict";
module.exports = (sequelize, DataTypes) => {
  const Degree = sequelize.define(
    "Degree",
    {
      applicantId: DataTypes.INTEGER,
      domainId: DataTypes.INTEGER,
      type: {
        type: DataTypes.ENUM,
        values: ["Bsc", "MSc", "PhD"], // Take a look at the migration (I dunno if we should add the values to it also)
      },
    },
    {}
  );
  Degree.associate = function (models) {
    // associations can be defined here
  };
  return Degree;
};
