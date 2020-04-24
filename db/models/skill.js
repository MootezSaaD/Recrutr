'use strict';
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  Skill.associate = function(models) {
    // associations can be defined here
  };
  return Skill;
};