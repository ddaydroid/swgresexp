'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schematic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schematic.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    baseType: DataTypes.STRING,
    complexity: DataTypes.INTEGER,
    xp: DataTypes.INTEGER,
    manufacture: DataTypes.BOOLEAN,
    schematicType: DataTypes.STRING,
    crateSize: DataTypes.INTEGER,
    miscDesc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Schematic',
  });
  return Schematic;
};