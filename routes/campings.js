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
router.post("/", function (req, res) {
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
router.get("/add", function (req, res) {
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

module.exports = router;
