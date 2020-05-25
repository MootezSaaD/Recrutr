'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasOne(models.Applicant, {
      foreignKey: {
        allowNull: false
      }
    });
    User.hasOne(models.Recruiter);
  };
  return User;
};