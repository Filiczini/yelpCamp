// all the middleware goes here
let middlewareObj = {};

// Checks owner of a camping and allow or disallow to do smth with camping
middlewareObj.checkOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    Camping.findById(req.params.id, function (err, foundCamp) {
      if (err) {
        redirect("back");
      } else {
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
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
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

// Checks User is logged in or not
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;
