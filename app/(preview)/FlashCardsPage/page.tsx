"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { useAppContext } from "../../context/context";
import { useRouter } from "next/navigation";
import PointsBox from "@/components/pointsBox";
export default function FlashCardsPage() {
  // State management for flashcard functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { questions, title, points, setPoints } = useAppContext();
  const router = useRouter();

  // Redirect to home if no questions available
  useEffect(() => {
    if (!questions?.length) {
      router.push("/");
    }
  }, [questions, router]);

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < (questions?.length ?? 0) - 1) {
      setCurrentIndex(curr => curr + 1);
      setIsFlipped(false);
      // Add point when moving to next card after seeing answer
      if (isFlipped) {
        setPoints(points + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
      setIsFlipped(false);
      // Add point when moving to previous card after seeing answer
      if (isFlipped) {
        setPoints(points + 1);
      }
    }
  };

  // Card flip handler
  const handleFlip = () => {
    if (!isFlipped) {
      // Add point when flipping to see answer
      setPoints(points + 1);
    }
    setIsFlipped(!isFlipped);
  };

  // Get current question data
  const currentQuestion = questions?.[currentIndex];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-4 relative">
      <PointsBox />
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-100">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="w-full max-w-4xl">
        {/* Header section with title and instructions */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            {title || "Study Cards"}
          </h2>
          <p className="text-xl text-zinc-400 mt-2">
            Click cards to reveal answers
          </p>
        </motion.div>

        {/* Flashcard container with 3D flip animation */}
        <div className="relative w-full aspect-[3/2] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className={`w-full h-full cursor-pointer`}
              onClick={handleFlip}
              initial={{ rotateY: 0, opacity: 0, scale: 0.8 }}
              animate={{
                rotateY: isFlipped ? 180 : 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 70,
                  damping: 15
                }
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front face of card showing question */}
              <div
                className={`absolute inset-0 backface-hidden rounded-2xl p-8 flex flex-col items-center justify-center
                  ${isFlipped ? "opacity-0" : "opacity-100"}
                  bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm 
                  border border-cyan-700/50 shadow-[0_0_25px_rgba(0,255,255,0.15)]
                  transition-all duration-500 ease-out`}
              >
                <p className="text-2xl text-cyan-100 text-center">
                  {currentQuestion?.question}
                </p>
              </div>

              {/* Back face of card showing answer */}
              <div
                className={`absolute inset-0 backface-hidden rounded-2xl p-8 flex flex-col items-center justify-center
                  ${isFlipped ? "opacity-100" : "opacity-0"}
                  bg-gradient-to-br from-purple-900/20 to-cyan-800/20 backdrop-blur-sm
                  border border-purple-500/50 shadow-[0_0_25px_rgba(147,51,234,0.15)]
                  transition-all duration-500 ease-out`}
                style={{ transform: "rotateY(180deg)" }}
              >
                <p className="text-2xl text-purple-100 text-center">
                  {currentQuestion?.answer}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation controls */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.2
          }}
          className="flex justify-between items-center mt-8"
        >
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="ghost"
            className="text-cyan-400 hover:text-cyan-100 hover:bg-cyan-900/20 transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
            Previous
          </Button>

          <div className="text-purple-400 font-mono">
            {currentIndex + 1} / {questions?.length ?? 0}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === (questions?.length ?? 0) - 1}
            variant="ghost"
            className="text-cyan-400 hover:text-cyan-100 hover:bg-cyan-900/20 transition-all duration-300"
          >
            Next
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>

        {/* Reset button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.4 
          }}
          className="flex justify-center mt-8"
        >
          <Button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            variant="ghost"
            className="text-purple-400 hover:text-purple-100 hover:bg-purple-900/20 transition-all duration-300"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Reset Cards
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
