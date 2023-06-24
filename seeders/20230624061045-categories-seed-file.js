'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Categories',
      ['團課類型', '獨立類型', '連鎖類型', '專項類型'].map((item) => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date(),
        }
      }),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', {})
  },
}
