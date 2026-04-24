'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    const hashedpassword = await bcrypt.hash('password123', saltRounds)

    await queryInterface.bulkInsert('user', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedpassword,
        firstname: 'Admin',
        lastname: 'Root',
        role: 'ADMIN',
        active: true
      },
      {
        username: 'jean',
        email: 'jean.dupont@example.com',
        password: hashedpassword,
        firstname: 'Jean',
        lastname: 'Dupont',
        role: 'INSURED',
        active: true
      },
      {
        username: 'marie',
        email: 'marie.martin@example.com',
        password: hashedpassword,
        firstname: 'Marie',
        lastname: 'Martin',
        role: 'INSURED',
        active: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
