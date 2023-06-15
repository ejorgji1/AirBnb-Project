'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      {
        // Define one-to-many association
        Spot.hasMany(models.Booking, { foreignKey: 'spotId',onDelete: 'CASCADE', hooks: true });
      }
      {
        // Define one-to-many association
        Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      }
      {
        // Define one-to-many association
        Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      }
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'Id', as: 'Owner'});
    }
  }
  Spot.init({
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
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};