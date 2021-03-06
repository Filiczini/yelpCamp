// define all reqires and settings
let express = require("express");
let bodyParser = require("body-parser");
let app = express();
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let methodOverride = require("method-override");
let User = require("./models/user");
let flash = require("connect-flash");

// adding routes
let campingsRoutes = require("./routes/campings");
let commentsRoutes = require("./routes/comments");
let authRoutes = require("./routes/auth");

// connect to db
mongoose.connect(
  "mongodb+srv://Filiczini:Mm11012580*@cluster0-29qqw.gcp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// middleware for routes
app.use("/campings", campingsRoutes);
app.use("/campings/:id/comments", commentsRoutes);
app.use(authRoutes);

app.get("/", function (req, res) {
  res.render("index");
});

// server start
app.listen(3000, function () {
  console.log("Server starts at: 3000");
});
