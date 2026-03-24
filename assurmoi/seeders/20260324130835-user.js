'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User', [
      {
        username: 'evan',
        password: 'test',
        firstname: 'Evan',
        lastname: 'TROGET',
        email: 'evantroget@monemail.com'
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', { username: 'nathan' })
  }
};
