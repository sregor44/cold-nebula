const Users = require('./users');
const Interests = require('./interests');

async function init(db) {
  await Users.init(db);
  await Interests.init(db);

  return true;
}

async function whipeDB(db) {
  await Users.destroy(db);
  await Interests.destroy(db);
}

module.exports = {
  init,
  whipeDB,
};
