let express = require("express");
let router = express.Router();
let Camping = require("../models/camping");
let middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function (req, res) {
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
      res.redirect("/campings");
    }
  });
});

// New - Show form to add New Camping
router.get("/add", middleware.isLoggedIn, function (req, res) {
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

// EDIT - edit a camping
router.get("/:id/edit", middleware.checkOwner, function (req, res) {
  Camping.findById(req.params.id, function (err, foundCamp) {
    if (err) {
      console.log(err);
    } else {
      res.render("campings/editCamping", { camping: foundCamp });
    }
  });
});

// UPDATE - update a campground
router.put("/:id", middleware.checkOwner, function (req, res) {
  Camping.findByIdAndUpdate(req.params.id, req.body.camping, function (
    err,
    updatedCamp
  ) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campings/" + req.params.id);
    }
  });
});

//DESTROY - delete the camping
router.delete("/:id", middleware.checkOwner, function (req, res) {
  Camping.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campings");
    }
  });
});

module.exports = router;
