'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      two_factor_secret: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
