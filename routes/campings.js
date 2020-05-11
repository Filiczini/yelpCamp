let express = require("express");
let router = express.Router();
let Camping = require("../models/camping");

// INDEX - Display all Campings
router.get("/", function (req, res) {
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
router.post("/", isLoggedIn, function (req, res) {
  let name = req.body.name;
  let url = req.body.url;
  let descr = req.body.descr;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let addCamping = {
    name: name,
    image: url,
    description: descr,
    author: author,
  };
  //create a new camping and save to db
  Camping.create(addCamping, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect("/campings");
    }
  });
});

// New - Show form to add New Camping
router.get("/add", isLoggedIn, function (req, res) {
  res.render("campings/addCamp");
});

// SHOW - Show more info about one Camping
router.get("/:id", function (req, res) {
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

// loging check func()
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;