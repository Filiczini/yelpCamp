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

//=================
// MAIN ROUTES
//=================

// INDEX - Display main page
app.get("/", function (req, res) {
  res.render("campings/index");
});
// INDEX - Display all Campings
app.get("/campings", function (req, res) {
  Camping.find({}, function (err, allCamps) {
    if (err) {
      console.log(err);
    } else {
      res.render("campings/campings", { campings: allCamps });
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
app.get("/campings/:id/comments/new", function (req, res) {
  Camping.findById(req.params.id, function (err, camping) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/addComment", { camping: camping });
    }
  });
});

// CREATE - Create a new comment
app.post("/campings/:id/comments", function (req, res) {
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

app.listen(3000, function () {
  console.log("Server starts at: 3000");
});
