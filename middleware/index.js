var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var Review     = require("../models/review");

var middlewareObj = {};

// ─── Authentication ───────────────────────────────────────────────────────────
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "You must be logged in to do that." });
};

// ─── Campground Authorization ─────────────────────────────────────────────────
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to do that." });
  }
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err || !foundCampground) {
      return res.status(404).json({ error: "Campground not found." });
    }
    if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
      req.campground = foundCampground; // attach to request for re-use in route
      return next();
    }
    return res.status(403).json({ error: "You do not have permission to do that." });
  });
};

// ─── Comment Authorization ────────────────────────────────────────────────────
middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to do that." });
  }
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err || !foundComment) {
      return res.status(404).json({ error: "Comment not found." });
    }
    if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
      req.comment = foundComment; // attach to request for re-use in route
      return next();
    }
    return res.status(403).json({ error: "You can only edit your own comments." });
  });
};

// ─── Review Authorization ─────────────────────────────────────────────────────
middlewareObj.checkReviewOwnership = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to do that." });
  }
  Review.findById(req.params.review_id, function (err, foundReview) {
    if (err || !foundReview) {
      return res.status(404).json({ error: "Review not found." });
    }
    if (foundReview.author.id.equals(req.user._id)) {
      req.review = foundReview; // attach to request for re-use in route
      return next();
    }
    return res.status(403).json({ error: "You can only edit your own reviews." });
  });
};

// ─── One Review Per User ──────────────────────────────────────────────────────
middlewareObj.checkReviewExistence = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in to do that." });
  }
  Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCampground) {
    if (err || !foundCampground) {
      return res.status(404).json({ error: "Campground not found." });
    }
    var alreadyReviewed = foundCampground.reviews.some(function (review) {
      return review.author.id.equals(req.user._id);
    });
    if (alreadyReviewed) {
      return res.status(409).json({ error: "You have already reviewed this campground." });
    }
    return next();
  });
};

module.exports = middlewareObj;