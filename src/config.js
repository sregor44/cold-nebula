module.exports = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallback: process.env.GOOGLE_CALLBACK,
  wipeDB: process.env.WIPE_DB,
  insertDefaultData: process.env.INSERT_DEFAULT,
};
