require("dotenv").config();

const express       = require("express"),
      app           = express(),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/user"),
      cors          = require("cors"),
      morgan        = require("morgan"),
      helmet        = require("helmet"),
      compression   = require("compression");

// ROUTES
const commentRoutes    = require("./routes/comments"),
      reviewRoutes     = require("./routes/reviews"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index");

// ─── DATABASE ────────────────────────────────────────────────────────────────
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
}).then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log("DB ERROR:", err.message);
});

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Compress all responses
app.use(compression());

// HTTP request logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// CORS — allow React dev server (and production domain) with credentials
const allowedOrigins = [
  "http://localhost:3000",   // React dev server (CRA default)
  "http://localhost:5173",   // React dev server (Vite default)
  process.env.CLIENT_URL,    // Production frontend URL from .env
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies/sessions across origins
}));

// Parse incoming JSON bodies (replaces body-parser for APIs)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (required by Passport)
app.use(require("express-session")({
  secret: process.env.PASSPORT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  }
}));

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Attach current user to every request (accessible in all route handlers)
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use("/api", indexRoutes);
app.use("/api/campgrounds", campgroundRoutes);
app.use("/api/campgrounds/:id/comments", commentRoutes);
app.use("/api/campgrounds/:id/reviews", reviewRoutes);

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use(function (req, res) {
  res.status(404).json({ error: "Route not found" });
});

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`YelpCamp API running on http://localhost:${port}`);
});