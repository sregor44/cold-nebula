async function init(db) {
  db.none(`
    CREATE TABLE IF NOT EXISTS interests(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      group_name varchar(255) NOT NULL
    );
  `);

  db.none(`
    CREATE TABLE IF NOT EXISTS users_interests(
      interest_id INT
            REFERENCES interests
              ON DELETE CASCADE
              ON UPDATE CASCADE,
      user_id INT
            REFERENCES users
              ON DELETE CASCADE
              ON UPDATE CASCADE,
      PRIMARY KEY (user_id, interest_id)
    );
  `);

  db.none(`
    CREATE TABLE IF NOT EXISTS clubs(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      interest_id INT
            REFERENCES interests
              ON DELETE CASCADE
              ON UPDATE CASCADE,
      club_name varchar(255) NOT NULL,
      description varchar(255) NOT NULL
    );
  `);
}

async function destroy(db) {
  db.none('DROP TABLE IF EXISTS interests;');
  db.none('DROP TABLE IF EXISTS clubs;')
  db.none('DROP TABLE IF EXSISTS users_interests;');
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
    INSERT INTO users_interests (user_id, interest_id)
    VALUES ($1, $2);
  `);
}

async function addClub(db, interestId, clubName, description) {
  const stmt = `
    INSERT INTO clubs (interest_id, club_name, description)
    VALUES ($1, $2, $3);
  `;

  db.none(stmt, [interestId, clubName, description]);
}

module.exports = {
  init,
  destroy,
  insert,
  addUserInterest,
  addClub,
};
