let Camping = require("../models/camping");
let Comment = require("../models/comment");

// all the middleware goes here
let middlewareObj = {};

// Checks owner of a camping and allow or disallow to do smth with camping
middlewareObj.checkOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    Camping.findById(req.params.id, function (err, foundCamp) {
      if (err) {
        req.flash("error", `Error: ${err}`);
        redirect("back");
      } else {
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to to that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/campings");
  }
};

// Checks owner of a comment and allow or disallow to do smth with comment
middlewareObj.checkCommentOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to to that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

// Checks User is logged in or not
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in");
  res.redirect("/login");
};

module.exports = middlewareObj;
