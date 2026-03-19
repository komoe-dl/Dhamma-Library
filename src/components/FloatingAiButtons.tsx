import React from 'react';
import { motion } from 'motion/react';
import { Bot, Languages } from 'lucide-react';

export default function FloatingAiButtons() {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end space-y-3 md:space-y-4">
      {/* Dhamma Translator Button - Small Ai Robot Button */}
      <motion.a
        href="https://gemini.google.com/gem/1jCz-YEC2AntA-LxKcnVr4fp-ctb49L6r?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center space-x-2 bg-zen-orange text-white p-2.5 md:p-3 rounded-full shadow-2xl hover:bg-zen-green transition-colors group relative"
        title="Dhamma Translator: Myanmar PDF to English"
      >
        <Bot className="w-4 h-4 md:w-5 md:h-5" />
        <span className="font-bold text-[10px] uppercase tracking-wider hidden md:group-hover:inline-block">Translator</span>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 px-3 py-1.5 bg-zen-gray-dark text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
          Dhamma Translator: Myanmar PDF to English
        </div>
      </motion.a>

      {/* Writer Button */}
      <motion.a
        href="https://gemini.google.com/gem/1gnW-Mt69wlYvExKi1f5uNo3oUzU2kxyj?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center space-x-2 md:space-x-3 bg-zen-green text-white p-2.5 md:px-5 md:py-3 rounded-full shadow-2xl hover:bg-zen-orange transition-colors group relative"
        title="Audio Transcribe Text and SRT File to Ebook by Write By Ai"
      >
        <div className="bg-white/20 p-1.5 md:p-2 rounded-full">
          <Bot className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <span className="font-bold text-xs md:text-sm uppercase tracking-wider hidden md:inline-block">Writer</span>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-zen-gray-dark text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
          Write By Ai: Audio & SRT to Ebook
        </div>
      </motion.a>
    </div>
  );
}
