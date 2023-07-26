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
        url: 'https://a0.muscache.com/im/pictures/0afff651-cafd-4d94-b694-808dfaf1f03b.jpg?im_w=1200',
        preview: true
      },
      {
       
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/49682fe5-544c-443f-a085-6746f1c88dbc.jpg?im_w=1440',
        preview: true
      },
      {
       
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/59d7ad94-9b88-4a68-93f7-22212e0e5bb1.jpg?im_w=1440',
        preview: true
      },
      {
       
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/8380325/d9c118ca_original.jpg?im_w=1200',
        preview: false
      },
      {
       
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/8380417/6efdc993_original.jpg?im_w=1440',
        preview: false
      },
      {
       
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/8380437/5f5863dd_original.jpg?im_w=1440',
        preview: false
      },
      {
        
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-715372110983087676/original/a33f982c-49b3-41e2-bfa7-5ed126bcd350.jpeg?im_w=1200',
        preview: false
      },{
        
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-715372110983087676/original/fe49bd58-9518-4c0a-990a-58ae23af82ab.jpeg?im_w=1440',
        preview: false
      },{
        
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-715372110983087676/original/76e1edeb-703b-41b2-801c-0246f646afe1.jpeg?im_w=1440',
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