var express    = require("express");
var router     = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

// ─── CREATE — POST new comment ────────────────────────────────────────────────
// POST /api/campgrounds/:id/comments
router.post("/", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err || !campground) {
      return res.status(404).json({ error: "Campground not found." });
    }
    Comment.create(req.body.comment, function (err, comment) {
      if (err) return res.status(500).json({ error: "Something went wrong." });
      comment.author.id       = req.user._id;
      comment.author.username = req.user.username;
      comment.save();
      campground.comments.push(comment);
      campground.save();
      res.status(201).json({ message: "Comment added.", comment: comment });
    });
  });
});

// ─── UPDATE — PUT comment ─────────────────────────────────────────────────────
// PUT /api/campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    { new: true },
    function (err, updatedComment) {
      if (err || !updatedComment) {
        return res.status(500).json({ error: "Something went wrong." });
      }
      res.json({ message: "Comment updated.", comment: updatedComment });
    }
  );
});

// ─── DELETE — DELETE comment ──────────────────────────────────────────────────
// DELETE /api/campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) return res.status(500).json({ error: "Something went wrong." });
    res.json({ message: "Comment deleted." });
  });
});

module.exports = router;
