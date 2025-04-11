'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExperimentalProperty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExperimentalProperty.init({
    id: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    drWeight: DataTypes.INTEGER,
    maWeight: DataTypes.INTEGER,
    oqWeight: DataTypes.INTEGER,
    srWeight: DataTypes.INTEGER,
    utWeight: DataTypes.INTEGER,
    flWeight: DataTypes.INTEGER,
    peWeight: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ExperimentalProperty',
  });
  return ExperimentalProperty;
};