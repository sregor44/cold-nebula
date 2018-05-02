async function init(db) {
  await db.none(`
      CREATE TABLE IF NOT EXISTS users(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name varchar(255) NOT NULL,
        email varchar(255) UNIQUE
            CHECK ( email ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' ),
        is_registered BOOLEAN DEFAULT FALSE NOT NULL,
        college varchar(255),
        grad_year INT
      );
    `);
}

async function destroy(db) {
  await db.none('DROP TABLE IF EXISTS users CASCADE;');
}

async function insert(db, name, email) {
  const stmt = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email, is_registered
  `;
  return db.one(stmt, [name, email]);
}

async function setRegisteredForEmail(db, email) {
  const stmt = `
      UPDATE users SET is_registered = TRUE
      WHERE
          users.email = $1;
  `;
  const result = await db.result(stmt, [email]);
  return result.rowCount;
}

async function setInfoForUser(db, email, college, grad_year) {
  const stmt = `
      UPDATE users SET college = $2, grad_year = $3
      WHERE
          users.email = $1;
  `;
  const result = await db.result(stmt, [email, college, grad_year]);
  return result.rowCount;
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
  destroy,
  insert,
  getByEmail,
  getByID,
  setRegisteredForEmail,
  setInfoForUser,
};
