'use strict';
const faker = require("faker");
let Wikis = [];
for(let i = 1 ; i <= 15 ; i++){
   Wikis.push({
     name: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     createdAt: new Date(),
     updatedAt: new Date()
   });
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", Wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
