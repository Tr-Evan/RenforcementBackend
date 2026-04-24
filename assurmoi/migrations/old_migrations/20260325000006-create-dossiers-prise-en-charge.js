'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dossiers_prise_en_charge', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      num_dossier: {
        type: Sequelize.STRING,
        allowNull: true
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
      current_step_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'workflow_steps',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      scenario_type: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      date_expertise_planifiee: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      date_expertise_effective: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      diagnostic_reparable: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      montant_indemnisation: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      approbation_client_indemnite: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      rib_client_joint: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      facture_tiers_reglee: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      is_clos: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dossiers_prise_en_charge');
  }
};
