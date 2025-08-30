// src/pages/HowItWorks.jsx
import Navbar from "../components/Navbar";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="text-center py-10 md:py-16 bg-green-100">
        <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-4">
          How Mangrove Watch Works
        </h1>
        <p className="text-base md:text-xl text-green-800 max-w-2xl mx-auto">
          Our platform makes it simple for anyone to help protect mangroves and track the impact of their actions.
        </p>
      </header>

      {/* Steps Section */}
      <main className="flex-grow container mx-auto py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-4xl md:text-5xl mb-4">📱</div>
            <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-3">1. Report Threats</h3>
            <p className="text-green-700 text-base md:text-lg">
              Use the app to report illegal activities like deforestation, pollution, or other threats to local mangrove areas.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-4xl md:text-5xl mb-4">🛰️</div>
            <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-3">2. Verification</h3>
            <p className="text-green-700 text-base md:text-lg">
              AI and satellite technology verify your reports to ensure accuracy, keeping the data trustworthy.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-4xl md:text-5xl mb-4">🏆</div>
            <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-3">3. Earn Rewards</h3>
            <p className="text-green-700 text-base md:text-lg">
              Verified contributions earn points, badges, and rewards while helping preserve critical ecosystems.
            </p>
          </div>
        </div>

        {/* Optional CTA */}
        <div className="text-center mt-10 md:mt-16">
          <a
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 rounded-2xl shadow-md transition-all hover:scale-105 text-base md:text-lg"
          >
            Join the Movement
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6 mt-auto">
        <div className="container mx-auto text-center text-green-300">
          <p>© {new Date().getFullYear()} Mangrove Watch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
