// src/pages/Impact.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Impact() {
  const [counters, setCounters] = useState({
    mangroves: 0,
    community: 0,
    species: 0,
    reports: 0
  });
  
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('impact-stats');
      if (element && !animated) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
          setAnimated(true);
          animateCounters();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animated]);

  const animateCounters = () => {
    const targetValues = {
      mangroves: 10000,
      community: 5000,
      species: 200,
      reports: 2500
    };
    
    const duration = 2000; // ms
    const steps = 60;
    const stepDuration = duration / steps;
    
    Object.keys(targetValues).forEach(key => {
      let currentStep = 0;
      const increment = targetValues[key] / steps;
      
      const timer = setInterval(() => {
        currentStep += 1;
        setCounters(prev => ({
          ...prev,
          [key]: Math.min(Math.floor(increment * currentStep), targetValues[key])
        }));
        
        if (currentStep >= steps) clearInterval(timer);
      }, stepDuration);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative text-center py-16 md:py-24 bg-gradient-to-b from-green-100 to-green-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 text-6xl">🌿</div>
          <div className="absolute top-20 right-1/4 text-5xl">🦀</div>
          <div className="absolute bottom-20 left-1/3 text-7xl">🐠</div>
          <div className="absolute bottom-10 right-1/3 text-6xl">🌱</div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Our <span className="text-green-700">Impact</span>
          </h1>
          <div className="w-24 h-1.5 bg-green-600 rounded-full mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-green-800 max-w-3xl mx-auto leading-relaxed">
            Discover how Mangrove Watch is transforming coastal conservation through community action, technology, and sustainable practices.
          </p>
        </div>
      </header>

      {/* Impact Stats */}
      <main className="flex-grow container mx-auto py-12 md:py-16 px-4">
        <div id="impact-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center mb-16">
          {/* Stat 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              {counters.mangroves.toLocaleString()}+
            </h3>
            <p className="text-green-700 font-medium">Mangroves Planted</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              {counters.community.toLocaleString()}+
            </h3>
            <p className="text-green-700 font-medium">Community Members Engaged</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">🦀</div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              {counters.species}+
            </h3>
            <p className="text-green-700 font-medium">Species Protected</p>
          </div>

          {/* Stat 4 - New */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              {counters.reports.toLocaleString()}+
            </h3>
            <p className="text-green-700 font-medium">Issues Reported & Resolved</p>
          </div>
        </div>

        {/* Impact Visualization */}
        <div className="bg-green-700 rounded-3xl p-8 md:p-12 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Conservation Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-300 mr-3"></span>
                Mangrove Coverage Increase
              </h3>
              <div className="bg-green-800/50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span>2018</span>
                  <span>2023</span>
                </div>
                <div className="w-full bg-green-900 rounded-full h-4">
                  <div className="bg-green-300 h-4 rounded-full w-3/4"></div>
                </div>
                <div className="text-right mt-2 text-green-200">+75% coverage</div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-300 mr-3"></span>
                Community Participation Growth
              </h3>
              <div className="bg-green-800/50 rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                  <span>2018</span>
                  <span>2023</span>
                </div>
                <div className="w-full bg-green-900 rounded-full h-4">
                  <div className="bg-green-300 h-4 rounded-full w-9/10"></div>
                </div>
                <div className="text-right mt-2 text-green-200">+200% participation</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Impact By Region</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Southeast Asia</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-green-900 rounded-full h-3">
                    <div className="bg-green-300 h-3 rounded-full w-[42%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Africa</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-green-900 rounded-full h-3">
                    <div className="bg-green-300 h-3 rounded-full w-[28%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Latin America</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-green-900 rounded-full h-3">
                    <div className="bg-green-300 h-3 rounded-full w-[18%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Other Regions</span>
                    <span>12%</span>
                  </div>
                  <div className="w-full bg-green-900 rounded-full h-3">
                    <div className="bg-green-300 h-3 rounded-full w-[12%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-4">Success Stories</h2>
          <p className="text-green-800 text-center max-w-2xl mx-auto mb-12">
            Real stories of transformation from communities and ecosystems we've helped protect
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-green-200 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🏝️</div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">Restoring Coastal Communities</h3>
              <p className="text-green-700 mb-4">
                In the Philippines, local fishing communities now benefit from sustainable fisheries and improved 
                protection against storm surges thanks to our mangrove restoration projects.
              </p>
              <div className="bg-green-100 p-4 rounded-xl">
                <p className="text-green-800 font-medium italic">
                  "The mangroves have brought back the fish and protected our village from the last typhoon."
                </p>
                <p className="text-green-700 text-sm mt-2">- Maria, Community Leader</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-green-200 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">Protecting Wildlife Habitats</h3>
              <p className="text-green-700 mb-4">
                In Indonesia, Mangrove Watch has helped preserve critical habitats for endangered species like 
                the proboscis monkey and various bird species, ensuring biodiversity thrives.
              </p>
              <div className="bg-green-100 p-4 rounded-xl">
                <p className="text-green-800 font-medium italic">
                  "We've seen a 40% increase in wildlife sightings since the mangrove restoration began."
                </p>
                <p className="text-green-700 text-sm mt-2">- Conservation Biologist</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <div className="bg-green-100 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="bg-white p-6 rounded-2xl shadow-md h-24 flex items-center justify-center">
              <span className="text-green-800 font-bold text-xl">Conservation International</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md h-24 flex items-center justify-center">
              <span className="text-green-800 font-bold text-xl">WWF</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md h-24 flex items-center justify-center">
              <span className="text-green-800 font-bold text-xl">UN Environment</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md h-24 flex items-center justify-center">
              <span className="text-green-800 font-bold text-xl">Local Communities</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-6">Join Our Growing Impact</h2>
          <p className="text-xl text-green-800 max-w-2xl mx-auto mb-8">
            Be part of our mission to protect and restore mangrove ecosystems worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/report"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl shadow-md transition-all hover:scale-105 text-lg font-semibold"
            >
              Report an Issue
            </a>
            {/* <a
              href="/volunteer"
              className="bg-white text-green-700 border border-green-300 hover:bg-green-50 px-8 py-4 rounded-2xl shadow-md transition-all hover:scale-105 text-lg font-semibold"
            >
              Volunteer
            </a>
            <a
              href="/donate"
              className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 rounded-2xl shadow-md transition-all hover:scale-105 text-lg font-semibold"
            >
              Donate
            </a> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6 mt-16">
        <div className="container mx-auto text-center text-green-300">
          <p>© {new Date().getFullYear()} Mangrove Watch. All rights reserved.</p>
          <p className="mt-2 text-sm">Creating measurable impact for mangrove ecosystems and communities</p>
        </div>
      </footer>
    </div>
  );
}