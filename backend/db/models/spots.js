'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      {
        // Define one-to-many association
        Spots.hasMany(models.Bookings, { foreignKey: 'spotId',onDelete: 'CASCADE', hooks: true });
      }
      {
        // Define one-to-many association
        Spots.hasMany(models.Reviews, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      }
      {
        // Define one-to-many association
        Spots.hasMany(models.SpotImages, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      }
      // define association here
      Spots.belongsTo(models.User, { foreignKey: 'Id', as: 'Owner'});
    }
  }
  Spots.init({
    ownerId:{
      type: DataTypes.INTEGER,
      allowNull : false
    },
    address: {
      type: DataTypes.STRING,
      allowNull : false
    },
    city: {
      type: DataTypes.STRING,
      allowNull : false
    },
    state: {
      type: DataTypes.STRING,
      allowNull : false
    },
    country: {
      type: DataTypes.STRING,
      allowNull : false
    },
    lat: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull : false
    },
    lng: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull : false
    },
    name: {
      type: DataTypes.STRING,
      allowNull : false
    },
    description: {
      type: DataTypes.STRING,
      allowNull : false
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Spots',
  });
  return Spots;
};