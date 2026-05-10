import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MapPin, Compass, ArrowRight, Mountain, Star, Clock, ShieldAlert } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';

const MOCK_TREKS = [
  {
    _id: "1",
    name: "Rajmachi Fort Trek",
    image: "https://images.unsplash.com/photo-1589136777351-fdc9c9cb164f?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Easy",
    safetyRating: 4.5,
    distance: "16",
    duration: "1 Day",
    requiredExperience: "Beginner",
    rating: 4.8
  },
  {
    _id: "2",
    name: "Harishchandragad",
    image: "https://images.unsplash.com/photo-1626242858882-9e20a402cb70?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Hard",
    safetyRating: 3.5,
    distance: "14",
    duration: "2 Days",
    requiredExperience: "Advanced",
    rating: 4.9
  },
  {
    _id: "3",
    name: "Torna Fort",
    image: "https://images.unsplash.com/photo-1605330366650-e83ce83ab9ee?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Moderate",
    safetyRating: 4.0,
    distance: "10",
    duration: "1 Day",
    requiredExperience: "Intermediate",
    rating: 4.7
  },
  {
    _id: "4",
    name: "Kalsubai Peak",
    image: "https://images.unsplash.com/photo-1611090333796-cf9b0ceceaf5?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Moderate",
    safetyRating: 4.2,
    distance: "6.6",
    duration: "1 Day",
    requiredExperience: "Intermediate",
    rating: 4.9
  },
  {
    _id: "5",
    name: "Visapur Fort",
    image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Easy",
    safetyRating: 4.0,
    distance: "8",
    duration: "1 Day",
    requiredExperience: "Beginner",
    rating: 4.5
  },
  {
    _id: "6",
    name: "Sinhagad Fort",
    image: "https://images.unsplash.com/photo-1643196924558-7484dfc2e353?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Easy",
    safetyRating: 4.8,
    distance: "5",
    duration: "Half Day",
    requiredExperience: "Beginner",
    rating: 4.6
  }
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          <Mountain className="h-5 w-5" />
          <span>PuneTreks</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/explore" className="hover:text-primary transition-colors">Explore</Link>
          <Link to="/community" className="hover:text-primary transition-colors">Community</Link>
          <div className="h-4 w-[1px] bg-border mx-2"></div>
          <Link to="/login" className="hover:text-primary transition-colors">Log In</Link>
          <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

function TrekCard({ trek }) {
  const getDifficultyBadge = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'moderate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'hard': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={trek.image} 
          alt={trek.name} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          {trek.rating.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-col p-5 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg leading-none tracking-tight">{trek.name}</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
           <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${getDifficultyBadge(trek.difficulty)}`}>
            {trek.difficulty}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" /> Safety: {trek.safetyRating}/5
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-auto border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{trek.distance} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{trek.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTreks(MOCK_TREKS);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 max-w-screen-xl">
          <div className="flex flex-col items-start gap-4 max-w-[800px]">
            <span className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              🏔️ Discover the Sahyadris
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
              Trekking intelligence for <br className="hidden sm:block"/> serious adventurers.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-[600px] mt-4">
              PuneTreks provides offline topography, real-time safety ratings, and the Angel Message dead-man's switch to keep you safe in the mountains.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a href="#explore" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link to="/community" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                Join Community
              </Link>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="container mx-auto px-6 max-w-screen-xl">
          <hr className="border-border" />
        </div>

        {/* Treks Grid */}
        <section id="explore" className="container mx-auto px-6 py-16 md:py-24 max-w-screen-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Popular Trails</h2>
              <p className="text-sm text-muted-foreground mt-1">Curated treks with verified safety ratings.</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-primary hover:underline flex items-center">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[350px] rounded-lg bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {treks.map(trek => (
                <Link to={`/treks/${trek._id}`} key={trek._id} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                  <TrekCard trek={trek} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-6 max-w-screen-xl text-sm text-muted-foreground">
          <p>
            Built for trekkers. Open source.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
