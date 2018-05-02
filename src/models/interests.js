async function init(db) {
  await db.none(`
    CREATE TABLE IF NOT EXISTS interests(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      group_name varchar(255) NOT NULL
    );
  `);

  await db.none(`
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

  await db.none(`
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
  const stmt = `
    INSERT INTO users_interests (user_id, interest_id)
    VALUES ($1, $2);
  `;

  db.none(stmt, [userId, interestId]);
}

async function deleteUserInterest(db, userId, interestId) {
  const stmt = `
      DELETE FROM users_interests
      WHERE user_id=$1 AND interest_id=$2
  `;

  db.none(stmt, [userId, interestId]);
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

async function getInterestsByUser(db, userId) {
  const stmt = `
      SELECT interests.id, interests.group_name
      FROM users_interests INNER JOIN interests
      ON interests.id=users_interests.interest_id
      WHERE user_id=$1;
  `;
  return db.any(stmt, [userId]);
}

async function getClubForInterest(db, interestId) {
  const stmt = "SELECT * FROM clubs WHERE interest_id=$1";
  return db.any(stmt, [interestId]);
}

async function getUsersForInterest(db, interestId) {
  const stmt = `
      SELECT users.name, users.email, users.college, users.grad_year, users_interests.user_id, users_interests.user_id
      FROM users_interests INNER JOIN users
      ON users.id=users_interests.user_id
      WHERE interest_id=$1;
  `;
  return db.any(stmt, [interestId]);
}

async function userHasInterest(db, userId, interestId) {
  const stmt = `
      SELECT count(1) FROM users_interests
      WHERE user_id=$1 AND interest_id=$2
  `;
  var result = await db.query(stmt, [userId, interestId]);

  return result[0].count != 0;
}

module.exports = {
  init,
  destroy,
  insert,
  addUserInterest,
  deleteUserInterest,
  addClub,
  getAllInterests,
  getInterestById,
  getClubForInterest,
  getInterestsByUser,
  getUsersForInterest,
  userHasInterest,
};
