import React, { useState } from "react";
import LocationBot from "./LocationBot";
import { Bot, X } from "lucide-react";

const GlobalBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bot Icon */}
      <button
        onClick={toggleBot}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        aria-label="Open Mangrove Watch Bot"
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-300" />
        ) : (
          <div className="relative">
            <Bot size={24} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Mangrove Watch Bot
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>

      {/* Chatbot Interface */}
      <LocationBot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default GlobalBot;
