import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
export default function Landing() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    "https://images.unsplash.com/photo-1592928309153-d1e92d5e59d7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1611251432024-3e2a9e7eca71?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-blue-50">
  <Navbar/>
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Protect our Mangroves Together
          </h1>
          
          <p className="text-lg md:text-xl text-green-800 mb-10 max-w-2xl mx-auto">
            Join the communities driven convrsation platform to monitor, report and protect mangrove ecosystems worldwide.
          </p>
          
          <div className="relative mb-10 max-w-3xl mx-auto h-80 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[currentImage]}
              alt="Mangrove ecosystem"
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentImage === index ? 'bg-white' : 'bg-white/50'}`}
                  onClick={() => setCurrentImage(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <Link to="/home">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-2xl shadow-md transition-all hover:scale-105">
              Get Started
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl mb-20">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">How You Can Help</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Report Incidents</h3>
              <p className="text-green-700">Use our mobile app to report illegal cutting, dumping, or other threats to mangroves.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="text-4xl mb-4">🛰️</div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">AI Verification</h3>
              <p className="text-green-700">Our system uses satellite data and AI to validate reports for accuracy.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Earn Rewards</h3>
              <p className="text-green-700">Collect points, climb leaderboards, and receive rewards for your contributions.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full max-w-4xl mb-20">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">How It Works</h2>
          
          <div className="relative">
            <div className="absolute left-5 md:left-1/2 top-0 h-full w-1 bg-green-300 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-6 rounded-2xl shadow-md relative">
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-green-600 border-4 border-white hidden md:block"></div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">1. Sign Up & Download</h3>
                <p className="text-green-700">Create an account and download our mobile app to get started.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-md relative md:mt-20">
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-green-600 border-4 border-white hidden md:block"></div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">2. Report Issues</h3>
                <p className="text-green-700">When you spot a threat to mangroves, report it with geotagged photos.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-md relative">
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-green-600 border-4 border-white hidden md:block"></div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">3. AI Validation</h3>
                <p className="text-green-700">Our system verifies reports using satellite imagery and AI analysis.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-md relative md:mt-20">
                <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-green-600 border-4 border-white hidden md:block"></div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">4. Earn Points</h3>
                <p className="text-green-700">Get rewarded with points for verified reports and climb the leaderboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="w-full max-w-5xl mb-16">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">Our Impact</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-green-100 p-4 rounded-2xl">
              <div className="text-3xl font-bold text-green-900">250+</div>
              <div className="text-green-700">Communities</div>
            </div>
            
            <div className="bg-green-100 p-4 rounded-2xl">
              <div className="text-3xl font-bold text-green-900">5,280</div>
              <div className="text-green-700">Reports Filed</div>
            </div>
            
            <div className="bg-green-100 p-4 rounded-2xl">
              <div className="text-3xl font-bold text-green-900">340</div>
              <div className="text-green-700">Hectares Protected</div>
            </div>
            
            <div className="bg-green-100 p-4 rounded-2xl">
              <div className="text-3xl font-bold text-green-900">12,500+</div>
              <div className="text-green-700">Trees Saved</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌿</span>
              <h2 className="text-xl font-bold">Mangrove Watch</h2>
            </div>
            <p className="text-green-200">
              Protecting coastal biodiversity through community participation and technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Get Involved</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Resources</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-green-200 hover:text-white transition-colors text-2xl" aria-label="Facebook">📘</a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-2xl" aria-label="Twitter">🐦</a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-2xl" aria-label="Instagram">📸</a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-2xl" aria-label="YouTube">📺</a>
            </div>
            <p className="text-green-200">support@mangrovewatch.org</p>
          </div>
        </div>
        
        <div className="container mx-auto mt-8 pt-8 border-t border-green-800 text-center text-green-300">
          <p>© {new Date().getFullYear()} Mangrove Watch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}