let express = require("express");
let request = require("request");
let bodyParser = require("body-parser");
let app = express();
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelpCamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

let campingSchema = new mongoose.Schema({
  name: String,
  image: String,
});

let Campground = mongoose.model("Campground", campingSchema);

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/campings", function (req, res) {
  Campground.find({}, function (err, allCamps) {
    if (err) {
      console.log(err);
    } else {
      res.render("campings", { campings: allCamps });
    }
  });
});

app.post("/campings", function (req, res) {
  let name = req.body.name;
  let url = req.body.url;
  let addCamping = { name: name, image: url };
  Campground.create(addCamping, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campings");
    }
  });
});

app.get("/campings/add", function (req, res) {
  res.render("addCamp");
});

app.listen(3000, function () {
  console.log("Server starts at: 3000");
});
