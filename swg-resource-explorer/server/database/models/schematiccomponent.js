'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SchematicComponent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SchematicComponent.init({
    id: DataTypes.INTEGER,
    schematicId: DataTypes.INTEGER,
    componentId: DataTypes.STRING,
    componentType: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    similar: DataTypes.BOOLEAN,
    optional: DataTypes.BOOLEAN,
    looted: DataTypes.BOOLEAN,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SchematicComponent',
  });
  return SchematicComponent;
};