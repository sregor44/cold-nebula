async function init(db) {
  db.none(`
    CREATE TABLE IF NOT EXISTS interests(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      group_name varchar(255) NOT NULL
    );
  `);

  db.none(`
    CREATE TABLE IF NOT EXISTS users_interests(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      interest_id INT NOT NULL,
      user_id INT NOT NULL
    );
  `);
}

async function destroy(db) {
  db.none('DROP TABLE IF EXISTS interests;');
  db.none('DROP TABLE IF EXSISTS users_interests');
}

async function insert(db, groupName) {
  //Returns the id of the newly inserted interest
  const stmt = `
      INSERT INTO interests (group_name)
      VALUES ($1)
      RETURNING id;
  `;
  return db.one(stmt, [groupName]);
}

async function addUserInterest(db, userId, interestId) {
  db.none(`
    INSERT INTO users_interests(user_id, interest_id)
    VALUES ($1, $2);
  `);
}

module.exports = {
  init,
  destroy,
  insert,
  addUserInterest,
};
