let mongoose = require("mongoose");

let campingSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Camping", campingSchema);
