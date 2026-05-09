# YelpCamp

A full-stack campground review web application built with Node.js, Express, MongoDB, and EJS.

## Features
- Browse and search campgrounds
- User registration and authentication (Passport.js)
- Create, edit, and delete campgrounds
- Add comments and star ratings/reviews
- Google Maps geocoding for campground locations
- Admin role with elevated permissions

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | Passport.js (Local Strategy) |
| Views | EJS (server-side rendering) |
| Styling | Bootstrap 5 + Custom CSS |
| Geocoding | Google Maps / node-geocoder |
| Security | Helmet, express-session, bcrypt |
| Testing | Jest + @shelf/jest-mongodb |

## 🗂️ Project Structure
```
YelpCamp/
├── app.js                ← Server entry point
├── package.json
├── middleware/
│   └── index.js          ← Auth guards & ownership checks
├── models/
│   ├── campground.js
│   ├── comment.js
│   ├── review.js
│   └── user.js
├── routes/
│   ├── index.js          ← Auth routes (login, register, logout)
│   ├── campgrounds.js    ← Campground CRUD
│   ├── comments.js       ← Comment CRUD
│   └── reviews.js        ← Review CRUD
├── views/
│   ├── partials/         ← Shared head, nav, footer
│   ├── campgrounds/
│   ├── comments/
│   ├── reviews/
│   └── users/
└── public/               ← Static CSS, JS, images
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Google Maps API key (for geocoding)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd YelpCamp-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root:
   ```env
   DATABASEURL=mongodb://localhost/yelpcamp
   PASSPORT_SECRET=your_secret_here
   GEOCODER_API_KEY=your_google_maps_api_key
   PORT=3000
   ```

4. **Run the app**
   ```bash
   # Development (hot reload)
   npm run dev

   # Production
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 🧪 Tests
```bash
npm test
```

## 📄 License
All rights reserved.
