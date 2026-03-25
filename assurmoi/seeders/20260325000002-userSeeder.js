'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const roles = await queryInterface.sequelize.query(
      `SELECT id from roles;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const roleAdmin = roles[0] ? roles[0].id : null;
    const roleAssure = roles[3] ? roles[3].id : null;

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password_hash: 'admin123',
        firstname: 'Admin',
        lastname: 'Root',
        role_id: roleAdmin,
        status: 'active',
        created_at: new Date()
      },
      {
        email: 'jean.dupont@example.com',
        password_hash: 'password123',
        firstname: 'Jean',
        lastname: 'Dupont',
        role_id: roleAssure,
        status: 'active',
        created_at: new Date()
      },
      {
        email: 'marie.martin@example.com',
        password_hash: 'password123',
        firstname: 'Marie',
        lastname: 'Martin',
        role_id: roleAssure,
        status: 'active',
        created_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
