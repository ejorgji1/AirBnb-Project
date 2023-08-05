'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
       
        spotId: 1,
        url: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: true
      },
      {
       
        spotId: 1,
        url: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: false
      },
      {
       
        spotId: 1,
        url: 'https://images.pexels.com/photos/2362002/pexels-photo-2362002.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: false
      },
      {
       
        spotId: 2,
        url: 'https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: true
      },
      {
       
        spotId: 2,
        url: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: false
      },
      {
       
        spotId: 2,
        url: 'https://images.pexels.com/photos/2366008/pexels-photo-2366008.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: false
      },
      {
        
        spotId: 3,
        url: 'https://images.pexels.com/photos/1388069/pexels-photo-1388069.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: true
      },{
        
        spotId: 3,
        url: 'https://images.pexels.com/photos/3879071/pexels-photo-3879071.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: false
      },{
        
        spotId: 3,
        url: 'https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600.jpeg',
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};