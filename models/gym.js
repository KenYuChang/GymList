'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Gym extends Model {
    static associate(models) {
      Gym.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Gym.hasMany(models.Comment, { foreignKey: 'gymId' })
      Gym.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'gymId',
        as: 'FavoritedUsers',
      })
    }
  }
  Gym.init(
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
      address: DataTypes.STRING,
      openingHours: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      viewCounts: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Gym',
      tableName: 'Gyms',
      underscored: true,
    }
  )
  return Gym
}
