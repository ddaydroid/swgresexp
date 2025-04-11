'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExperimentalProperties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      drWeight: {
        type: Sequelize.INTEGER
      },
      maWeight: {
        type: Sequelize.INTEGER
      },
      oqWeight: {
        type: Sequelize.INTEGER
      },
      srWeight: {
        type: Sequelize.INTEGER
      },
      utWeight: {
        type: Sequelize.INTEGER
      },
      flWeight: {
        type: Sequelize.INTEGER
      },
      peWeight: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ExperimentalProperties');
  }
};