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
      description varchar(2000)
    );
  `);
}

async function destroy(db) {
  await db.none('DROP TABLE IF EXISTS interests CASCADE;');
  await db.none('DROP TABLE IF EXISTS clubs;')
  await db.none('DROP TABLE IF EXISTS users_interests;');
}

async function insert(db, groupName) {
  //Returns the id of the newly inserted interest
  const stmt = `
      INSERT INTO interests (group_name)
      VALUES ($1)
      RETURNING id, group_name;
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

async function getAllInterests(db) {
  return db.any('SELECT * FROM interests;');
}

async function getInterestById(db, id) {
  const stmt = 'SELECT * FROM interests WHERE id=$1';
  return db.one(stmt, [id]);
}

async function getClubForInterest(db, interestId) {
  const stmt = "SELECT * FROM clubs WHERE interest_id=$1";
  return db.any(stmt, [interestId]);
}

async function getUsersForInterest(db, interestId) {
  const stmt = `
      SELECT users.name, users.email, users.college, users.grad_year
      FROM users_interests INNER JOIN users
      ON users.id=users_interests.user_id
      WHERE interest_id=$1;
  `;
  return db.any(stmt, [interestId]);
}

module.exports = {
  init,
  destroy,
  insert,
  addUserInterest,
  addClub,
  getAllInterests,
  getInterestById,
  getClubForInterest,
  getUsersForInterest,
};
