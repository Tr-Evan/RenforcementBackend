'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Roles
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      label: { type: Sequelize.STRING, allowNull: false }
    });

    // 2. User
    await queryInterface.createTable('user', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING, unique: true, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      firstname: { type: Sequelize.STRING },
      lastname: { type: Sequelize.STRING },
      role: {
        type: Sequelize.ENUM('ADMIN', 'PORTFOLIO_MANAGER', 'FOLLOW_UP_OFFICER', 'CUSTOMER_SERVICE_OFFICER', 'INSURED'),
        defaultValue: 'INSURED'
      },
      token: { type: Sequelize.TEXT },
      refresh_token: { type: Sequelize.TEXT },
      two_step_code: { type: Sequelize.STRING },
      active: { type: Sequelize.BOOLEAN, defaultValue: true }
    });

    // 3. Documents
    await queryInterface.createTable('documents', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      sinistre_id: { type: Sequelize.INTEGER },
      dossier_id: { type: Sequelize.INTEGER },
      type_document: { type: Sequelize.STRING },
      url_storage: { type: Sequelize.STRING },
      is_validated: { type: Sequelize.BOOLEAN, defaultValue: false },
      validated_by_id: { type: Sequelize.INTEGER, references: { model: 'user', key: 'id' } },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 4. Sinistres
    await queryInterface.createTable('sinistres', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      reference: { type: Sequelize.STRING, unique: true },
      immatriculation: { type: Sequelize.STRING },
      conducteur_nom: { type: Sequelize.STRING },
      conducteur_prenom: { type: Sequelize.STRING },
      is_conducteur_assure: { type: Sequelize.BOOLEAN },
      date_appel: { type: Sequelize.DATE },
      date_accident: { type: Sequelize.DATE },
      contexte: { type: Sequelize.TEXT },
      responsabilite_pourcentage: { type: Sequelize.INTEGER },
      status_validation: {
        type: Sequelize.ENUM('BROUILLON', 'EN_ATTENTE_VALIDATION', 'VALIDE', 'REJETE'),
        defaultValue: 'BROUILLON'
      },
      assure_id: { type: Sequelize.INTEGER, references: { model: 'user', key: 'id' } },
      cni_driver_id: { type: Sequelize.INTEGER, references: { model: 'documents', key: 'id' } },
      carte_grise_id: { type: Sequelize.INTEGER, references: { model: 'documents', key: 'id' } },
      attestation_assurance_id: { type: Sequelize.INTEGER, references: { model: 'documents', key: 'id' } },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 5. Dossiers de prise en charge
    await queryInterface.createTable('dossiers_prise_en_charge', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      num_dossier: { type: Sequelize.STRING, unique: true },
      sinistre_id: { type: Sequelize.INTEGER, references: { model: 'sinistres', key: 'id' } },
      status: {
        type: Sequelize.ENUM(
          'INITIALISE', 'EXPERTISE_EN_ATTENTE', 'EXPERTISE_PLANIFIEE', 'EXPERTISE_REALISEE',
          'INTERVENTION_A_PLANIFIER', 'INTERVENTION_PLANIFIEE', 'PRISE_EN_CHARGE_PLANIFIEE',
          'PRISE_EN_CHARGE_REALISEE', 'INTERVENTION_EN_COURS', 'RESTITUTION_A_PLANIFIER',
          'RESTITUTION_EN_COURS', 'RESTITUE_ATTENTE_FACTURE', 'FACTURE_RECUE', 'REGLEMENT_REALISE',
          'ATTENTE_GARANTIE', 'ATTENTE_REF_TIERS', 'INDEMNISATION_ESTIMEE', 'INDEMNISATION_VALIDEE',
          'INDEMNISATION_ATTENTE_REGLEMENT', 'CLOS'
        ),
        defaultValue: 'INITIALISE'
      },
      scenario_type: { type: Sequelize.ENUM('REPARABLE', 'NON_REPARABLE') },
      date_expertise_planifiee: { type: Sequelize.DATE },
      date_expertise_effective: { type: Sequelize.DATE },
      date_retour_expertise: { type: Sequelize.DATE },
      diagnostic_reparable: { type: Sequelize.BOOLEAN },
      rapport_expertise_id: { type: Sequelize.INTEGER, references: { model: 'documents', key: 'id' } },
      date_intervention_planifiee: { type: Sequelize.DATE },
      date_prise_en_charge_planifiee: { type: Sequelize.DATE },
      date_prise_en_charge_effective: { type: Sequelize.DATE },
      date_debut_intervention_effective: { type: Sequelize.DATE },
      date_fin_intervention: { type: Sequelize.DATE },
      date_restitution_planifiee: { type: Sequelize.DATE },
      date_restitution_effective: { type: Sequelize.DATE },
      date_reception_facture: { type: Sequelize.DATE },
      facture_prestataire_id: { type: Sequelize.INTEGER, references: { model: 'documents', key: 'id' } },
      date_reglement_prestataire: { type: Sequelize.DATE },
      montant_indemnisation_estime: { type: Sequelize.DECIMAL(10, 2) },
      date_previsionnelle_prise_en_charge: { type: Sequelize.DATE },
      rib_assure_id: { type: Sequelize.INTEGER, references: { model: 'documents', key: 'id' } },
      date_indemnisation_reglee: { type: Sequelize.DATE },
      is_clos: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 6. Logs Actions
    await queryInterface.createTable('logs_actions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      entity_type: { type: Sequelize.STRING },
      entity_id: { type: Sequelize.INTEGER },
      user_id: { type: Sequelize.INTEGER, references: { model: 'user', key: 'id' } },
      action_description: { type: Sequelize.TEXT },
      old_status: { type: Sequelize.STRING },
      new_status: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logs_actions');
    await queryInterface.dropTable('dossiers_prise_en_charge');
    await queryInterface.dropTable('sinistres');
    await queryInterface.dropTable('documents');
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('roles');
  }
};
