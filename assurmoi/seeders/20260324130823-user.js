'use strict';
const bcrypt = require('bcrypt')
require('dotenv').config()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    const hashedpassword = await bcrypt.hash('MotDeP@ss123', saltRounds)
    
    await queryInterface.bulkInsert('user', [
      {
        username: 'saittirite',
        password: hashedpassword,
        firstname: 'Soufian',
        lastname: 'AIT TIRITE',
        email: 's.aittirite@websociety.fr',
        role: 'ADMIN',
        active: true
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', { username: 'saittirite' })
  }
};
