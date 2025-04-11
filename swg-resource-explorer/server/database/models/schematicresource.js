'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SchematicResource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SchematicResource.init({
    id: DataTypes.INTEGER,
    schematicId: DataTypes.INTEGER,
    resourceType: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SchematicResource',
  });
  return SchematicResource;
};