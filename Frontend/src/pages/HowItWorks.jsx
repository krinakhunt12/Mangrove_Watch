// src/pages/HowItWorks.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animated Step Component
const AnimatedStep = ({ number, emoji, title, description, delay }) => {
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
      className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all relative overflow-hidden group"
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Step number */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      
      <motion.div
        variants={emojiVariants}
        className="text-5xl mb-4 inline-block"
      >
        {emoji}
      </motion.div>
      <h3 className="text-xl md:text-2xl font-semibold text-green-800 mb-3 tracking-wide">
        {title}
      </h3>
      <p className="text-green-700 text-base md:text-lg font-light tracking-wide leading-relaxed">
        {description}
      </p>
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

export default function HowItWorks() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-green-50 relative overflow-hidden">
      {/* Animated background elements */}
      <FloatingBackgroundElements />
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center py-10 md:py-16 bg-green-100 relative"
      >
        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
          <svg 
            className="relative block w-full h-12 md:h-20" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-green-50"
            ></path>
          </svg>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-green-900 mb-4 tracking-wide"
        >
          How Mangrove Watch Works
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base md:text-xl text-green-800 max-w-2xl mx-auto font-light tracking-wide"
        >
          Our platform makes it simple for anyone to help protect mangroves and
          track the impact of their actions.
        </motion.p>
        
        {/* Animated underline */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="h-1 bg-green-600 mx-auto mt-6 rounded-full"
        />
      </motion.header>

      {/* Steps Section */}
      <main className="flex-grow container mx-auto py-10 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
          <AnimatedStep
            number={1}
            emoji="📱"
            title="Report Threats"
            description="Use the app to report illegal activities like deforestation, pollution, or other threats to local mangrove areas."
            delay={0.1}
          />
          
          <AnimatedStep
            number={2}
            emoji="🛰️"
            title="Verification"
            description="AI and satellite technology verify your reports to ensure accuracy, keeping the data trustworthy."
            delay={0.3}
          />
          
          <AnimatedStep
            number={3}
            emoji="🏆"
            title="Earn Rewards"
            description="Verified contributions earn points, badges, and rewards while helping preserve critical ecosystems."
            delay={0.5}
          />
        </div>

        {/* Animated connecting line for steps */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden md:block h-1 bg-green-300 mx-auto my-8 rounded-full max-w-4xl transform origin-left"
        />
        
        {/* Optional CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-20"
        >
          <motion.a
            href="/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 md:px-10 py-4 rounded-2xl shadow-md transition-all text-lg md:text-xl tracking-wide relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button shine effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
            Join the Movement
          </motion.a>
        </motion.div>
      </main>

      {/* Animated wave divider */}
      <div className="relative w-full overflow-hidden h-20 -mt-5">
        <svg 
          className="relative block w-full h-full" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-green-200"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-green-200"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-green-200"
          ></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6 mt-auto relative z-10">
        <div className="container mx-auto text-center text-green-300 tracking-wide">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Mangrove Watch. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}