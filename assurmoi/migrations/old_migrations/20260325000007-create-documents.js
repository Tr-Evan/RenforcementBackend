'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      sinistre_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sinistres',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      dossier_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'dossiers_prise_en_charge',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      type_document: {
        type: Sequelize.STRING,
        allowNull: true
      },
      url_storage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_validated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      validated_by_id: {
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
    await queryInterface.dropTable('documents');
  }
};
