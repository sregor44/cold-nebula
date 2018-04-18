const Users = require('./users');

async function init(db) {
  await Users.init(db);
}

module.exports = {
  init,
};
