module.exports = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.DATABASE_URL || "postgresql://localhost:5432/connectedu",
  secret: process.env.SECRET || "secret",
  googleClientID: process.env.GOOGLE_CLIENT_ID || "225408048160-62knbub9d2h6u1ljhl3abmvouepgtvkb.apps.googleusercontent.com",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "RtbKZYVf17q7k6lPCqAdWfQN",
  googleCallback: process.env.GOOGLE_CALLBACK || "http://localhost:3000/auth/google/callback",
};
