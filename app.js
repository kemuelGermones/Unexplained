require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const helmetConfig = require("./configs/helmet");
const sessionConfig = require("./configs/session");
const User = require("./models/user");
const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");
const userRoute = require("./routes/user");
const AppError = require("./utils/AppError");

const app = express();

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/unexplained";
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(helmet.contentSecurityPolicy(helmetConfig));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.originalUrl = req.originalUrl;
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoute);
app.use("/posts", postRoute);
app.use("/posts/:postId/comments", commentRoute);

app.all("*", (req, res, next) => {
  next(new AppError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).render("pages/error.ejs", { message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening to Port " + PORT);
});
