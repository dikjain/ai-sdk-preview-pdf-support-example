"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { z } from "zod";
import { questionsSchema } from "@/lib/schemas";

// Props interface for the Cards component
interface CardsProps {
  questions: z.infer<typeof questionsSchema>;
  onReset: () => void;
}

export default function Cards({ questions, onReset }: CardsProps) {
  // State for tracking current card index and flip state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
      setIsFlipped(false);
    }
  };

  // Card flip handler
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background gradients */}
      <motion.div 
        className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-violet-500 [text-shadow:_0_0_30px_rgb(96_165_250_/_50%)]">
            Flashcards
          </h2>
          <p className="text-xl text-zinc-400 mt-2 animate-pulse">
            Click the card to reveal the answer
          </p>
        </motion.div>

        {/* Flashcard container with 3D flip animation */}
        <div className="relative w-full aspect-[3/2] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className={`w-full h-full cursor-pointer`}
              onClick={handleFlip}
              initial={{ rotateY: 0, opacity: 0 }}
              animate={{
                rotateY: isFlipped ? 180 : 0,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front face - Question */}
              <div
                className={`absolute inset-0 backface-hidden rounded-2xl p-8 flex flex-col items-center justify-center
                  ${isFlipped ? "opacity-0" : "opacity-100"}
                  bg-gradient-to-br from-zinc-900/80 to-black/80 backdrop-blur-xl
                  border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]
                  hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow duration-300`}
              >
                <p className="text-2xl text-white [text-shadow:_0_0_10px_rgb(255_255_255_/_30%)] text-center">
                  {questions[currentIndex].question}
                </p>
              </div>

              <div
                className={`absolute inset-0 backface-hidden rounded-2xl p-8 flex flex-col items-center justify-center
                  ${isFlipped ? "opacity-100" : "opacity-0"}
                  bg-gradient-to-br from-blue-950/90 to-violet-950/90 backdrop-blur-xl
                  border border-blue-500/20 shadow-[0_0_15px_rgba(147,51,234,0.5)]
                  hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-shadow duration-300`}
                style={{ transform: "rotateY(180deg)" }}
              >
                <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 font-medium text-center [text-shadow:_0_0_20px_rgb(96_165_250_/_30%)]">
                  {questions[currentIndex].answer}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div 
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
            Previous
          </Button>

          <div className="text-zinc-400 font-medium">
            {currentIndex + 1} of {questions.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
          >
            Next
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>

        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onReset}
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
