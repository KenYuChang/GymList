'use strict'

/** @type {import('sequelize-cli').Migration} */
const faker = require('faker')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Gyms',
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/gym/?random=${Math.random() * 100}`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Gyms', {})
  },
}
