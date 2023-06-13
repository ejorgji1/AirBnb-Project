'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookings.belongsTo(models.User, { foreignKey: 'Id' });
      Bookings.belongsTo(models.Spots, { foreignKey: 'Id' });
    }
    }
  }
  Bookings.init({
    spoId:  { 
      type : DataTypes.INTEGER,
      allowNull : false 
    },
    userId:  {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'Bookings',
  });
  return Bookings;
};