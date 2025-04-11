'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Resource.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    typeId: DataTypes.STRING,
    availableTimestamp: DataTypes.INTEGER,
    availableBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Resource',
  });
  return Resource;
};