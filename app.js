if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const AppError = require("./utils/AppError");
const reportRoute = require("./routes/report");
const commentRoute = require("./routes/comment");
const userRoute = require("./routes/user");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

// Mongoose Connection

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/anomalies";
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

// Helmet middleware for security

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
        "https://images.pexels.com",
      ],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
    },
  })
);

// Template engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Parses incoming requests

app.use(express.urlencoded({ extended: true }));

// Lets you use HTTP verbs in places where the client doesn’t support it.

app.use(methodOverride("_method"));

// Serves static files

app.use(express.static(path.join(__dirname, "public")));

// Searches for any keys in objects that begin with a '$' sign or contain a '.'
// from req.body, req.query or req.params
// and replaces it with '_'.

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// Connect mongo config

const secret = process.env.SECRET || "thisshouldbeasecret";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  ttl: 24 * 60 * 60,
});

// Session Configuration

const sessionConfig = {
  store,
  name: "__uINmw",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // WORKS FOR HTTPS ONLY
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Use the session middleware

app.use(session(sessionConfig));

// Flashes msg middlware

app.use(flash());

// Passport config & middleware

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set variables accessible to templates

app.use((req, res, next) => {
  res.locals.currentCategory = req.query.category;
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes

app.use("/", userRoute);
app.use("/reports", reportRoute);
app.use("/reports/:id/comments", commentRoute);

// New error if a route is not recognized

app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

// Error Handler

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).render("error.ejs", { err });
});

// listens for connections on the given path

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening to Port " + port);
});
