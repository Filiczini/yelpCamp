let mongosse = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongosse.Schema({
  username: String,
  password: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongosse.model("User", UserSchema);
