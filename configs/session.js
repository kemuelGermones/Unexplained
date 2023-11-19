require("dotenv").config();

const MongoStore = require("connect-mongo");

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/unexplained";
const SECRET = process.env.SECRET || "thisShouldBeASecret";

const store = MongoStore.create({
  mongoUrl: DB_URL,
  secret: SECRET,
  ttl: 24 * 60 * 60,
});

const sessionConfig = {
  store,
  name: "__uINmw",
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

module.exports = sessionConfig;
