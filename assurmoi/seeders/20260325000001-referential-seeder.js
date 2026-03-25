'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { label: 'Admin' },
      { label: 'Gestionnaire' },
      { label: 'Expert' },
      { label: 'Assuré' }
    ]);

    await queryInterface.bulkInsert('workflow_steps', [
      { label: 'Ouverture du dossier', order_index: 1 },
      { label: 'En attente de documents', order_index: 2 },
      { label: 'Expertise planifiée', order_index: 3 },
      { label: 'En cours de réparation', order_index: 4 },
      { label: 'Indemnisation', order_index: 5 },
      { label: 'Clôturé', order_index: 6 }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workflow_steps', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
