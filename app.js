let express = require("express");
let request = require("request");
let bodyParser = require("body-parser");
let app = express();
let mongoose = require("mongoose");
let Camping = require("./models/camping");

mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// INDEX - Display main page
app.get("/", function (req, res) {
  res.render("index");
});
// INDEX - Display all Campings
app.get("/campings", function (req, res) {
  Camping.find({}, function (err, allCamps) {
    if (err) {
      console.log(err);
    } else {
      res.render("campings", { campings: allCamps });
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
  res.render("addCamp");
});
// SHOW - Show more info about one Camping
app.get("/campings/:id", function (req, res) {
  Camping.findById(req.params.id, function (err, oneCamp) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { camping: oneCamp });
    }
  });
});

app.listen(3000, function () {
  console.log("Server starts at: 3000");
});
