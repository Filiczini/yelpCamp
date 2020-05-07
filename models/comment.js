let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let commentSchema = new Schema({
  text: String,
  author: String,
});

module.exports = mongoose.model("Comment", commentSchema);
