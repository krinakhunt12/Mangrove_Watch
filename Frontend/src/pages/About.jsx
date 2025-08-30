// src/pages/About.jsx
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-3xl shadow-xl p-6 md:p-12 border border-green-200">
        <h1 className="text-3xl md:text-5xl font-extrabold text-green-900 mb-4 text-center flex items-center justify-center gap-3">
          <span className="text-3xl">🌱</span> About Mangrove Watch
        </h1>

        <div className="flex justify-center mb-8">
          <span className="inline-block w-24 md:w-32 h-1 rounded-full bg-green-600 animate-pulse"></span>
        </div>

        <p className="mb-6 text-base md:text-xl text-gray-800 leading-relaxed text-center">
          <span className="font-semibold text-green-700">Mangrove Watch</span> is a community-driven initiative dedicated to protecting and restoring mangrove ecosystems worldwide. Our platform empowers individuals, researchers, and organizations to monitor mangrove health, report issues, and take meaningful action to preserve these critical habitats.
        </p>

        <p className="mb-6 text-base md:text-xl text-gray-800 leading-relaxed text-center">
          Mangroves are vital for <span className="font-semibold text-green-800">coastal protection</span>, <span className="font-semibold text-green-700">biodiversity</span>, and <span className="font-semibold text-green-800">carbon sequestration</span>. By using innovative tools and engaging local communities, Mangrove Watch aims to create a sustainable future for our planet's mangrove forests.
        </p>

        <p className="text-base md:text-xl text-gray-800 leading-relaxed text-center">
          <span className="font-semibold text-green-900">Join us</span> in our mission to safeguard mangroves and ensure the health of coastal ecosystems for generations to come.
        </p>

        <div className="flex justify-center mt-10">
          <a 
            href="#report" 
            className="px-6 md:px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all duration-300"
          >
            Report an Issue
          </a>
        </div>
      </div>
    </div>
  );
}
