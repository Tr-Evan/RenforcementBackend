'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sinistres', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true
      },
      immatriculation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      conducteur_nom: {
        type: Sequelize.STRING,
        allowNull: true
      },
      conducteur_prenom: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_conducteur_assure: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      date_appel: {
        type: Sequelize.DATE,
        allowNull: true
      },
      date_accident: {
        type: Sequelize.DATE,
        allowNull: true
      },
      contexte: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      responsabilite_pourcentage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status_validation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_by_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assure_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sinistres');
  }
};
