let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");

// SHOW - show register form
router.get("/register", function (req, res) {
  res.render("register");
});

// POST - register a user
router.post("/register", function (req, res) {
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
router.get("/login", function (req, res) {
  res.render("login");
});

// POST - login a user
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campings",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// GET - Logout route
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// loging check func()
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
