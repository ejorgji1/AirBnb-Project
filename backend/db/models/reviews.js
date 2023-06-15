'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here›
      {
        // Define one-to-many association
        Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: "CASCADE", hooks: true});
      }
      Review.belongsTo(models.Spot, { foreignKey: 'Id' });
      Review.belongsTo(models.User, { foreignKey: 'Id' });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    review:{
      type: DataTypes.STRING,
      allowNull : false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};