var mongoose = require("mongoose");

var trekSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Trek name cannot be blank."
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Moderate", "Hard", "Expert"],
    default: "Moderate"
  },
  requiredExperience: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Professional"],
    default: "Beginner"
  },
  safetyRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  distance: Number, // in km
  duration: String, // e.g., "1 Day", "2 Days"
  maxAltitude: Number, // in feet or meters
  bestSeason: String,
  image: {
    type: String,
    required: "Trek image cannot be blank."
  },
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  rating: {
    type: Number,
    default: 0
  }
});

const Comment = require("./comment");
trekSchema.pre("remove", async function() {
  await Comment.remove({
    _id: {
      $in: this.comments
    }
  });
});

module.exports = mongoose.model("Trek", trekSchema);