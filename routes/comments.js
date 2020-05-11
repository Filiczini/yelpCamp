let express = require("express");
let router = express.Router({ mergeParams: true });
let Camping = require("../models/camping");
let Comment = require("../models/comment");

// NEW - Display Form To Add Comment
router.get("/new", isLoggedIn, function (req, res) {
  Camping.findById(req.params.id, function (err, camping) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/addComment", { camping: camping });
    }
  });
});

// CREATE - Create a new comment
router.post("/", isLoggedIn, function (req, res) {
  Camping.findById(req.params.id, function (err, camping) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          camping.comments.push(comment);
          camping.save();
          res.redirect("/campings/" + camping._id);
        }
      });
    }
  });
});

// loging check func()
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
