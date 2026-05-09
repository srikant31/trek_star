var express    = require("express");
var router     = express.Router();
var passport   = require("passport");
var User       = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get("/", function (req, res) {
  res.json({ message: "YelpCamp API is running." });
});

// ─── Get Current Logged-In User ───────────────────────────────────────────────
router.get("/me", middleware.isLoggedIn, function (req, res) {
  res.json({ user: req.user });
});

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post("/register", function (req, res) {
  var newUser = new User({
    username:  req.body.username,
    firstName: req.body.firstName,
    lastName:  req.body.lastName,
    email:     req.body.email,
    avatar:    req.body.avatar,
    isAdmin:   false,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      res.status(201).json({
        message: "Registration successful.",
        user: {
          _id:       user._id,
          username:  user.username,
          firstName: user.firstName,
          lastName:  user.lastName,
          email:     user.email,
          avatar:    user.avatar,
          isAdmin:   user.isAdmin,
        },
      });
    });
  });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err)   return next(err);
    if (!user) return res.status(401).json({ error: info && info.message ? info.message : "Invalid username or password." });
    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.json({
        message: "Login successful.",
        user: {
          _id:       user._id,
          username:  user.username,
          firstName: user.firstName,
          lastName:  user.lastName,
          email:     user.email,
          avatar:    user.avatar,
          isAdmin:   user.isAdmin,
        },
      });
    });
  })(req, res, next);
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
router.post("/logout", function (req, res) {
  req.logout();
  res.json({ message: "Logged out successfully." });
});

// ─── USER PROFILE ─────────────────────────────────────────────────────────────
router.get("/users/:id", function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      return res.status(404).json({ error: "User not found." });
    }
    Campground.find().where("author.id").equals(foundUser._id).exec(function (err, campgrounds) {
      if (err) {
        return res.status(500).json({ error: "Something went wrong." });
      }
      res.json({
        user: {
          _id:       foundUser._id,
          username:  foundUser.username,
          firstName: foundUser.firstName,
          lastName:  foundUser.lastName,
          email:     foundUser.email,
          avatar:    foundUser.avatar,
          isAdmin:   foundUser.isAdmin,
        },
        campgrounds: campgrounds,
      });
    });
  });
});

module.exports = router;