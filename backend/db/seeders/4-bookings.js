'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
      
        spotId: 2,
        userId: 3,
        startDate: '01-01-2023',
        endDate:'01-02-2023'
      },
      {
      
       
        spotId: 3,
        userId: 2,
        startDate: '01-02-2023',
        endDate:'01-03-2023'
      },
      {
       
      
        spotId: 1,
        userId: 1,
        startDate: '01-03-2023',
        endDate:'01-04-2023'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};