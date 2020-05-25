"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Degrees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      applicantId: {
        type: Sequelize.INTEGER,
      },
      domainId: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM("Bsc", "MSc", "PhD"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Degrees");
  },
};
