'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Categories',
      ['團課', '獨立', '連鎖', '專項'].map((item) => {
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
