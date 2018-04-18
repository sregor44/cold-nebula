async function init(db) {
  db.none(`
      CREATE TABLE IF NOT EXISTS users(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name varchar(255) NOT NULL,
        email varchar(255) UNIQUE
            CHECK ( email ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' )
      );
    `);
}

async function insert(db, name, email) {
  const stmt = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email
  `;
  return db.one(stmt, [name, email]);
}

async function getByEmail(db, email) {
  const stmt = `
      SELECT * FROM users WHERE
      email=lower($1)
  `;
  return db.oneOrNone(stmt, [email]);
}

async function getByID(db, id) {
  const stmt = `
      SELECT * FROM users WHERE
      id=$1
  `;
  return db.oneOrNone(stmt, [id]);
}

module.exports = {
  init,
  insert,
  getByEmail,
  getByID,
};
