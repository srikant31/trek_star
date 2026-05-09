var express      = require("express");
var router       = express.Router();
var Campground   = require("../models/campground");
var middleware   = require("../middleware");
var NodeGeocoder = require("node-geocoder");

// Google Geocoder
var geocoder = NodeGeocoder({
  provider:    "google",
  httpAdapter: "https",
  apiKey:      process.env.GEOCODER_API_KEY,
  formatter:   null,
});

// ─── INDEX — GET all campgrounds ──────────────────────────────────────────────
// GET /api/campgrounds
// GET /api/campgrounds?search=yosemite
router.get("/", function (req, res) {
  if (req.query.search) {
    var regex = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
    Campground.find({ name: regex }, function (err, campgrounds) {
      if (err) return res.status(500).json({ error: "Something went wrong." });
      res.json({ campgrounds: campgrounds, count: campgrounds.length });
    });
  } else {
    Campground.find({}, function (err, campgrounds) {
      if (err) return res.status(500).json({ error: "Something went wrong." });
      res.json({ campgrounds: campgrounds.reverse(), count: campgrounds.length });
    });
  }
});

// ─── CREATE — POST new campground ─────────────────────────────────────────────
// POST /api/campgrounds
router.post("/", middleware.isLoggedIn, function (req, res) {
  var { name, image, description, price, location } = req.body;
  var author = { id: req.user._id, username: req.user.username };

  geocoder.geocode(location, function (err, data) {
    if (err || !data || !data.length) {
      return res.status(400).json({ error: "Invalid location. Could not geocode address." });
    }
    var newCampground = {
      name,
      image,
      description,
      price,
      author,
      location: data[0].formattedAddress,
      lat:      data[0].latitude,
      lng:      data[0].longitude,
    };
    Campground.create(newCampground, function (err, campground) {
      if (err) return res.status(500).json({ error: "Something went wrong." });
      res.status(201).json({ message: "Campground created.", campground: campground });
    });
  });
});

// ─── SHOW — GET one campground ────────────────────────────────────────────────
// GET /api/campgrounds/:id
router.get("/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .populate({ path: "reviews", options: { sort: { createdAt: -1 } } })
    .exec(function (err, campground) {
      if (err || !campground) return res.status(404).json({ error: "Campground not found." });
      res.json({ campground: campground });
    });
});

// ─── UPDATE — PUT campground ──────────────────────────────────────────────────
// PUT /api/campgrounds/:id
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  delete req.body.campground.rating; // prevent manual rating manipulation
  var { name, image, description, price, location } = req.body;

  geocoder.geocode(location, function (err, data) {
    if (err || !data || !data.length) {
      return res.status(400).json({ error: "Invalid location. Could not geocode address." });
    }
    var updatedData = {
      name,
      image,
      description,
      price,
      location: data[0].formattedAddress,
      lat:      data[0].latitude,
      lng:      data[0].longitude,
    };
    Campground.findByIdAndUpdate(req.params.id, updatedData, { new: true }, function (err, campground) {
      if (err || !campground) return res.status(500).json({ error: "Something went wrong." });
      res.json({ message: "Campground updated.", campground: campground });
    });
  });
});

// ─── DELETE — DELETE campground ───────────────────────────────────────────────
// DELETE /api/campgrounds/:id
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err || !campground) return res.status(404).json({ error: "Campground not found." });
    campground.remove(function (err) {
      if (err) return res.status(500).json({ error: "Something went wrong." });
      res.json({ message: "Campground deleted successfully." });
    });
  });
});

module.exports = router;
