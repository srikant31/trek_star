var express    = require("express");
var router     = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Review     = require("../models/review");
var middleware = require("../middleware");

// Helper: recalculate campground average rating
function calculateAverage(reviews) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

// ─── INDEX — GET all reviews for a campground ──────────────────────────────────
// GET /api/campgrounds/:id/reviews
router.get("/", function (req, res) {
  Campground.findById(req.params.id)
    .populate({ path: "reviews", options: { sort: { createdAt: -1 } } })
    .exec(function (err, campground) {
      if (err || !campground) {
        return res.status(404).json({ error: "Campground not found." });
      }
      res.json({ reviews: campground.reviews, rating: campground.rating });
    });
});

// ─── CREATE — POST new review ─────────────────────────────────────────────────
// POST /api/campgrounds/:id/reviews
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
  Campground.findById(req.params.id).populate("reviews").exec(function (err, campground) {
    if (err || !campground) {
      return res.status(404).json({ error: "Campground not found." });
    }
    Review.create(req.body.review, function (err, review) {
      if (err) return res.status(400).json({ error: err.message });
      review.author.id       = req.user._id;
      review.author.username = req.user.username;
      review.campground      = campground;
      review.save();
      campground.reviews.push(review);
      campground.rating = calculateAverage(campground.reviews);
      campground.save();
      res.status(201).json({ message: "Review added.", review: review, newRating: campground.rating });
    });
  });
});

// ─── UPDATE — PUT review ──────────────────────────────────────────────────────
// PUT /api/campgrounds/:id/reviews/:review_id
router.put("/:review_id", middleware.checkReviewOwnership, function (req, res) {
  Review.findByIdAndUpdate(
    req.params.review_id,
    req.body.review,
    { new: true },
    function (err, updatedReview) {
      if (err) return res.status(400).json({ error: err.message });
      Campground.findById(req.params.id).populate("reviews").exec(function (err, campground) {
        if (err || !campground) return res.status(404).json({ error: "Campground not found." });
        campground.rating = calculateAverage(campground.reviews);
        campground.save();
        res.json({ message: "Review updated.", review: updatedReview, newRating: campground.rating });
      });
    }
  );
});

// ─── DELETE — DELETE review ───────────────────────────────────────────────────
// DELETE /api/campgrounds/:id/reviews/:review_id
router.delete("/:review_id", middleware.checkReviewOwnership, function (req, res) {
  Review.findByIdAndRemove(req.params.review_id, function (err) {
    if (err) return res.status(500).json({ error: "Something went wrong." });
    Campground.findByIdAndUpdate(
      req.params.id,
      { $pull: { reviews: req.params.review_id } },
      { new: true }
    ).populate("reviews").exec(function (err, campground) {
      if (err || !campground) return res.status(404).json({ error: "Campground not found." });
      campground.rating = calculateAverage(campground.reviews);
      campground.save();
      res.json({ message: "Review deleted.", newRating: campground.rating });
    });
  });
});

module.exports = router;