let express = require("express");
let bodyParser = require("body-parser");
let app = express();
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let Camping = require("./models/camping");
let User = require("./models/user");
let Comment = require("./models/comment");

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

//=================
// MAIN ROUTES
//=================

// INDEX - Display main page
app.get("/", function (req, res) {
  res.render("campings/index");
});

// INDEX - Display all Campings
app.get("/campings", function (req, res) {
  console.log(req.user);
  Camping.find({}, function (err, allCamps) {
    if (err) {
      console.log(err);
    } else {
      res.render("campings/campings", {
        campings: allCamps,
        currentUser: req.user,
      });
    }
  });
});

// CREATE - Add new Camping to DB
app.post("/campings", function (req, res) {
  let name = req.body.name;
  let url = req.body.url;
  let descr = req.body.descr;
  let addCamping = { name: name, image: url, description: descr };
  Camping.create(addCamping, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campings");
    }
  });
});

// New - Show form to add New Camping
app.get("/campings/add", function (req, res) {
  res.render("campings/addCamp");
});

// SHOW - Show more info about one Camping
app.get("/campings/:id", function (req, res) {
  Camping.findById(req.params.id)
    .populate("comments")
    .exec(function (err, oneCamp) {
      if (err) {
        console.log(err);
      } else {
        res.render("campings/show", { camping: oneCamp });
      }
    });
});

// ===================
// COMMENTS ROUTES
//====================

// NEW - Display Form To Add Comment
app.get("/campings/:id/comments/new", isLoggedIn, function (req, res) {
  Camping.findById(req.params.id, function (err, camping) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/addComment", { camping: camping });
    }
  });
});

// CREATE - Create a new comment
app.post("/campings/:id/comments", isLoggedIn, function (req, res) {
  Camping.findById(req.params.id, function (err, camping) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          camping.comments.push(comment);
          camping.save();
          res.redirect("/campings/" + camping._id);
        }
      });
    }
  });
});

// =====================
// AUTH ROUTES
// =====================

// SHOW - show register form
app.get("/register", function (req, res) {
  res.render("register");
});

// POST - register a user
app.post("/register", function (req, res) {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/campings");
      });
    }
  });
});

// SHOW - show login form
app.get("/login", function (req, res) {
  res.render("login");
});

// POST - login a user
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campings",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// GET - Logout route
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function () {
  console.log("Server starts at: 3000");
});
