module.exports = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.DATABASE_URL || "postgresql://localhost:5432/connectedu",
  secret: process.env.SECRET || "secret",
};
