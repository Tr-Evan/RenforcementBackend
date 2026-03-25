'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workflow_steps', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      label: {
        type: Sequelize.STRING,
        allowNull: true
      },
      order_index: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workflow_steps');
  }
};
