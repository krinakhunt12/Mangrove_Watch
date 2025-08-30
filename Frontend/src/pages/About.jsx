// src/pages/About.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animated Stat Card Component
const AnimatedStatCard = ({ number, title, description, delay }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: "easeOut",
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: delay + 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="bg-white rounded-2xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all relative overflow-hidden group"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <motion.div
        variants={numberVariants}
        className="text-4xl font-bold text-green-700 mb-3"
      >
        {number}
      </motion.div>
      <h3 className="text-xl font-semibold text-green-900 mb-2">{title}</h3>
      <p className="text-green-800">{description}</p>
    </motion.div>
  );
};

// Animated Importance Card Component
const AnimatedImportanceCard = ({ emoji, title, description, delay }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeOut",
      },
    },
  };

  const emojiVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay + 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="bg-green-800/30 p-6 rounded-2xl text-center backdrop-blur-sm hover:bg-green-800/40 transition-all duration-300 group"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        variants={emojiVariants}
        className="text-4xl mb-4 inline-block"
      >
        {emoji}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-green-100">{description}</p>
    </motion.div>
  );
};

// Floating elements background component
const FloatingBackgroundElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-200 opacity-40"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 30 + 10}px`,
          }}
          animate={{
            y: [0, Math.random() * 40 - 20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {["🌿", "🦀", "🦩", "🌊", "🐠"][i % 5]}
        </motion.div>
      ))}
    </div>
  );
};

// Animated Tab Component
const AnimatedTab = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "mission", label: "Our Mission" },
    { id: "impact", label: "Our Impact" },
    { id: "approach", label: "Our Approach" },
  ];

  return (
    <div className="flex flex-wrap border-b border-green-200 mb-8 relative">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 font-medium text-lg rounded-t-lg transition-all relative z-10 ${
            activeTab === tab.id
              ? "text-green-700"
              : "text-green-600 hover:text-green-700"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

// Tab Content Component with animation
const TabContent = ({ activeTab }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView, activeTab]);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const content = {
    mission: (
      <div>
        <h2 className="text-2xl font-bold text-green-900 mb-4">Our Mission</h2>
        <p className="mb-4 text-lg text-gray-800 leading-relaxed">
          Mangrove Watch is a community-driven initiative dedicated to protecting and restoring mangrove ecosystems worldwide. Our platform empowers individuals, researchers, and organizations to monitor mangrove health, report issues, and take meaningful action to preserve these critical habitats.
        </p>
        <p className="text-lg text-gray-800 leading-relaxed">
          We believe that through technology, education, and community engagement, we can reverse mangrove loss and ensure these vital ecosystems thrive for generations to come.
        </p>
      </div>
    ),
    impact: (
      <div>
        <h2 className="text-2xl font-bold text-green-900 mb-4">Our Impact</h2>
        <p className="mb-4 text-lg text-gray-800 leading-relaxed">
          Since our founding, Mangrove Watch has facilitated the protection of over 10 million mangroves across 15 countries. Our community reporting system has helped identify and address over 2,000 conservation issues before they became critical.
        </p>
        <p className="text-lg text-gray-800 leading-relaxed">
          We've trained and equipped local communities with the tools and knowledge to monitor and protect their mangrove forests, creating sustainable conservation models that benefit both people and nature.
        </p>
      </div>
    ),
    approach: (
      <div>
        <h2 className="text-2xl font-bold text-green-900 mb-4">Our Approach</h2>
        <p className="mb-4 text-lg text-gray-800 leading-relaxed">
          Our approach combines cutting-edge technology with on-the-ground action. We utilize satellite monitoring, drone surveys, and community reporting to create a comprehensive picture of mangrove health worldwide.
        </p>
        <p className="text-lg text-gray-800 leading-relaxed">
          We partner with local communities, governments, and research institutions to develop science-based conservation strategies that address both environmental and socioeconomic factors affecting mangrove ecosystems.
        </p>
      </div>
    ),
  };

  return (
    <motion.div
      ref={ref}
      variants={contentVariants}
      initial="hidden"
      animate={controls}
      key={activeTab}
      className="min-h-[300px]"
    >
      {content[activeTab]}
    </motion.div>
  );
};

export default function About() {
  const [activeTab, setActiveTab] = useState("mission");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 relative overflow-hidden">
      {/* Animated background elements */}
      <FloatingBackgroundElements />
      
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative py-16 md:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-green-200/30 w-full h-full"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-green-900 mb-6 tracking-wide"
          >
            About <span className="text-green-700">Mangrove Watch</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-2 bg-green-600 rounded-full mx-auto mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-green-800 max-w-3xl mx-auto leading-relaxed tracking-wide"
          >
            Protecting and restoring mangrove ecosystems through community engagement, technology, and conservation science.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <AnimatedStatCard
            number="10M+"
            title="Mangroves Protected"
            description="Across 15 countries worldwide through our initiatives"
            delay={0.1}
          />
          
          <AnimatedStatCard
            number="5K+"
            title="Active Volunteers"
            description="Contributing to monitoring and conservation efforts"
            delay={0.2}
          />
          
          <AnimatedStatCard
            number="200+"
            title="Scientific Studies"
            description="Supported to advance mangrove conservation science"
            delay={0.3}
          />
        </div>

        {/* Tabbed Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-green-200 mb-16"
        >
          <AnimatedTab activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent activeTab={activeTab} />
        </motion.div>

        {/* Importance Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-green-700 rounded-3xl shadow-xl p-8 md:p-12 text-white mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center tracking-wide"
          >
            Why Mangroves Matter
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedImportanceCard
              emoji="🌊"
              title="Coastal Protection"
              description="Reduce storm surge and prevent erosion"
              delay={0.1}
            />
            
            <AnimatedImportanceCard
              emoji="🐠"
              title="Biodiversity"
              description="Nursery habitats for marine species"
              delay={0.2}
            />
            
            <AnimatedImportanceCard
              emoji="🌍"
              title="Carbon Sequestration"
              description="Store 4x more carbon than rainforests"
              delay={0.3}
            />
            
            <AnimatedImportanceCard
              emoji="👨‍👩‍👧‍👦"
              title="Livelihoods"
              description="Support coastal communities worldwide"
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-green-900 mb-6 tracking-wide">Join Our Mission</h2>
          <p className="text-xl text-green-800 max-w-3xl mx-auto mb-8 tracking-wide">
            Whether you're a concerned citizen, researcher, or organization, there's a place for you in our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a 
              href="/report" 
              className="px-8 py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
              Report an Issue
            </motion.a>
            <motion.a 
              href="/get-involved" 
              className="px-8 py-4 rounded-full bg-white text-green-700 border border-green-300 hover:bg-green-50 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-green-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
              Get Involved
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6 relative z-10">
        <div className="container mx-auto text-center text-green-300 tracking-wide">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Mangrove Watch. All rights reserved.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-2 text-sm"
          >
            Protecting mangrove ecosystems through community reporting and conservation science
          </motion.p>
        </div>
      </footer>
    </div>
  );
}