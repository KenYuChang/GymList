'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Gym extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Gym.init(
    {
      name: DataTypes.STRING,
      role: DataTypes.STRING,
      experience: DataTypes.TEXT,
      description: DataTypes.TEXT,
      certificate: DataTypes.TEXT,
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
