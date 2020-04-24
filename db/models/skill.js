"use strict";
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {}
  );
  Skill.associate = function (models) {
    Skill.belongsToMany(models.JobOffer, { through: models.JobOfferSkill });
    Skill.hasMany(models.JobOfferSkill);
  };
  return Skill;
};
