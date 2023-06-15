'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
      
        ownerId: 1,
        address: '1 Main St',
        city: 'Boston',
        state:'MA',
        country:'USA',
        lat:1.00,
        lng:2.00,
        name:'Name1',
        description:'Ocean View',
        price: 100.00
      },
      {
       
        ownerId: 2,
        address: '2 Main St',
        city: 'New York',
        state:'NY',
        country:'USA',
        lat:2.00,
        lng:3.00,
        name:'Name2',
        description:'Mountain View',
        price: 200.00
      },
      {
        
        ownerId: 3,
        address: '3 Main St',
        city: 'Newport',
        state:'RI',
        country:'USA',
        lat:2.00,
        lng:3.00,
        name:'Name3',
        description:'Ocean Front',
        price: 300.00
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};