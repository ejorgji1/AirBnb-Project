'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
<<<<<<< HEAD:backend/db/seeders/20230602213428-demo-user.js
        firstName:'Name1',
        lastName:'Last1',
=======
        firstName:'name1',
        lastName:'last1',
>>>>>>> dev:backend/db/seeders/1-demo-user.js
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
<<<<<<< HEAD:backend/db/seeders/20230602213428-demo-user.js
        firstName:'Name2',
        lastName:'Last2',
=======
        firstName:'name2',
        lastName:'last2',
>>>>>>> dev:backend/db/seeders/1-demo-user.js
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
<<<<<<< HEAD:backend/db/seeders/20230602213428-demo-user.js
        firstName:'Name3',
        lastName:'Last3',
=======
        firstName:'name3',
        lastName:'last3',
>>>>>>> dev:backend/db/seeders/1-demo-user.js
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};