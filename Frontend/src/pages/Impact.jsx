// src/pages/Impact.jsx
import Navbar from "../components/Navbar";

export default function Impact() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="text-center py-10 md:py-16 bg-green-100">
        <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-4">
          Our Impact
        </h1>
        <p className="text-base md:text-xl text-green-800 max-w-2xl mx-auto">
          See how Mangrove Watch is helping preserve mangroves, protect wildlife, and empower communities.
        </p>
      </header>

      {/* Impact Stats */}
      <main className="flex-grow container mx-auto py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {/* Stat 1 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">
            <div className="text-4xl md:text-6xl mb-4">🌱</div>
            <h3 className="text-lg md:text-2xl font-bold text-green-800 mb-2">10,000+</h3>
            <p className="text-green-700 text-base md:text-lg">Mangroves Planted</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">
            <div className="text-4xl md:text-6xl mb-4">👥</div>
            <h3 className="text-lg md:text-2xl font-bold text-green-800 mb-2">5,000+</h3>
            <p className="text-green-700 text-base md:text-lg">Community Members Engaged</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">
            <div className="text-4xl md:text-6xl mb-4">🦀</div>
            <h3 className="text-lg md:text-2xl font-bold text-green-800 mb-2">200+</h3>
            <p className="text-green-700 text-base md:text-lg">Species Protected</p>
          </div>
        </div>

        {/* Stories Section */}
        <section className="mt-10 md:mt-20">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Restoring Coastal Communities</h3>
              <p className="text-green-700">
                Local communities now benefit from sustainable fisheries and improved protection against storm surges thanks to our mangrove restoration projects.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Protecting Wildlife Habitats</h3>
              <p className="text-green-700">
                Mangrove Watch has helped preserve critical habitats for endangered species, ensuring biodiversity thrives along coastal areas.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl shadow-md transition-all hover:scale-105 text-lg"
          >
            Get Involved
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
