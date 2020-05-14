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

//EDIT - Edit an exist comment by ID
router.get("/:comment_id/edit", function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/editComment", {
        camping_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

//UPDATE - UPDATE an exist comment by ID
router.put("/:comment_id", function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updateComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campings/" + req.params.id);
    }
  });
});

//DESTROY - DESTROY an exist comment by ID
router.delete("/:comment_id", function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campings/" + req.params.id);
    }
  });
});

// Middleware - loging check func()
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
