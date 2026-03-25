'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(`SELECT id, email FROM users;`, { type: Sequelize.QueryTypes.SELECT });
    const adminUser = users.find(u => u.email === 'admin@example.com');
    const assureUser1 = users.find(u => u.email === 'jean.dupont@example.com');

    // Insert Sinistre
    await queryInterface.bulkInsert('sinistres', [
      {
        reference: 'SIN-2026-001',
        immatriculation: 'AB-123-CD',
        conducteur_nom: 'Dupont',
        conducteur_prenom: 'Jean',
        is_conducteur_assure: true,
        date_appel: new Date(),
        date_accident: new Date(),
        contexte: 'Accident sur parking',
        responsabilite_pourcentage: 0,
        status_validation: 'en_attente',
        created_by_id: adminUser ? adminUser.id : null,
        assure_id: assureUser1 ? assureUser1.id : null
      }
    ]);

    const sinistres = await queryInterface.sequelize.query(`SELECT id FROM sinistres LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
    const sinistreId = sinistres[0] ? sinistres[0].id : null;

    const steps = await queryInterface.sequelize.query(`SELECT id FROM workflow_steps LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
    const stepId = steps[0] ? steps[0].id : null;

    // Insert Dossier Prise En Charge
    if (sinistreId && stepId) {
      await queryInterface.bulkInsert('dossiers_prise_en_charge', [
        {
          num_dossier: 'DOS-2026-001',
          sinistre_id: sinistreId,
          current_step_id: stepId,
          scenario_type: 1,
          date_expertise_planifiee: new Date().toISOString().split('T')[0],
          date_expertise_effective: null,
          diagnostic_reparable: null,
          montant_indemnisation: null,
          approbation_client_indemnite: null,
          rib_client_joint: false,
          facture_tiers_reglee: false,
          is_clos: false
        }
      ]);
      
      const dossiers = await queryInterface.sequelize.query(`SELECT id FROM dossiers_prise_en_charge LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT });
      const dossierId = dossiers[0] ? dossiers[0].id : null;

      // Insert Document
      await queryInterface.bulkInsert('documents', [
        {
          sinistre_id: sinistreId,
          dossier_id: dossierId,
          type_document: 'constat',
          url_storage: 'https://storage.example.com/docs/constat.pdf',
          is_validated: false,
          validated_by_id: null
        }
      ]);
    }

    // Insert Logs
    await queryInterface.bulkInsert('logs_actions', [
      {
        entity_type: 'sinistre',
        entity_id: sinistreId,
        user_id: adminUser ? adminUser.id : null,
        action_description: 'Création du sinistre SIN-2026-001',
        old_status: null,
        new_status: 'en_attente',
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('logs_actions', null, {});
    await queryInterface.bulkDelete('documents', null, {});
    await queryInterface.bulkDelete('dossiers_prise_en_charge', null, {});
    await queryInterface.bulkDelete('sinistres', null, {});
  }
};
