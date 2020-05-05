let express = require("express");
let request = require("request");
let parser = require("body-parser");
let app = express();
let campings = [
  {
    name: "Crazy Creak",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Swallow Peak",
    image:
      "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Wonder Moby",
    image:
      "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
];

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/campings", function (req, res) {
  res.render("campings", { campings: campings });
});

app.listen(3000, function () {
  console.log("Server starts at: 3000");
});
