'use strict';
const bcrypt = require('bcrypt')
require('dotenv').config()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedpassword = await bcrypt.hash('MotDeP@ss123', parseInt(process.env.BCRYPT_SALT))
    await queryInterface.bulkInsert('User', [
      {
        username: 'saittirite',
        password: hashedpassword,
        firstname: 'Soufian',
        lastname: 'AIT TIRITE',
        email: 's.aittirite@websociety.fr',
        role: 'superadmin'
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', { username: 'saittirite' })
  }
};
