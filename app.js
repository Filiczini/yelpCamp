// define all reqires and settings
let express = require("express");
let bodyParser = require("body-parser");
let app = express();
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let Camping = require("./models/camping");
let User = require("./models/user");
let Comment = require("./models/comment");

// adding routes
let campingsRoutes = require("./routes/campings");
let commentsRoutes = require("./routes/comments");
let authRoutes = require("./routes/auth");

// connect to db
mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "alina plays chess",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for LOG IN checking
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// middleware for routes
app.use(campingsRoutes);
app.use(commentsRoutes);
app.use(authRoutes);

// server start
app.listen(3000, function () {
  console.log("Server starts at: 3000");
});
