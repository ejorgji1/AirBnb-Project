'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
       
        reviewId: 1,
        url: 'image1'
      },
      {
        
        reviewId: 2,
        url: 'image2'
      },
      {
    
        reviewId: 3,
        url: 'image3'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};