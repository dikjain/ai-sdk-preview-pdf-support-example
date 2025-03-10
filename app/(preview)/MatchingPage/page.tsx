"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCw, ChevronLeft } from "lucide-react";
import { useAppContext } from "../../context/context";
import { useRouter } from "next/navigation";
import PointsBox from "@/components/pointsBox";
export default function MatchingPage() {
  // State management for game logic
  const [selectedPair, setSelectedPair] = useState<number[]>([]); // Tracks currently selected cards
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]); // Tracks successfully matched pairs
  const [shuffledPairs, setShuffledPairs] = useState<{text: string, id: number}[]>([]); // Stores shuffled Q&A pairs
  
  // Get questions and title from context
  const { questions, title, points, setPoints } = useAppContext();
  const router = useRouter();

  // Initialize game on component mount
  useEffect(() => {
    if (!questions?.length) {
      router.push("/"); // Redirect if no questions available
    } else {
      initializeGame();
    }
  }, [questions, router]);

  // Handle card selection and matching logic
  const handleCardClick = (index: number, id: number) => {
    // Prevent selecting already matched cards or selecting when 2 cards are flipped
    if (matchedPairs.includes(id) || selectedPair.length === 2) return;
    
    const newSelected = [...selectedPair, index];
    setSelectedPair(newSelected);

    // Check for match when second card is selected
    if (newSelected.length === 2) {
      const firstCard = shuffledPairs[newSelected[0]];
      const secondCard = shuffledPairs[newSelected[1]];

      if (firstCard.id === secondCard.id) {
        // Cards match - add to matched pairs and increment points
        setMatchedPairs([...matchedPairs, firstCard.id]);
        setPoints(points + 1);
        setSelectedPair([]);
      } else {
        // Cards don't match - flip back after delay
        setTimeout(() => setSelectedPair([]), 1000);
      }
    }
  };

  // Reset game state with newly shuffled pairs
  const resetGame = () => {
    initializeGame();
    setSelectedPair([]);
    setMatchedPairs([]);
  };

  // Helper function to create and shuffle Q&A pairs
  const initializeGame = () => {
    const pairs = questions?.flatMap((q, idx) => [
      { text: q.question, id: idx },
      { text: q.answer, id: idx }
    ]) || [];
    setShuffledPairs(pairs.sort(() => Math.random() - 0.5));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-4 relative">
      <PointsBox />
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-100"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="w-full max-w-4xl">
        {/* Header section with title and instructions */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            {title || "Matching Quiz"}
          </h2>
          <p className="text-xl text-zinc-400 mt-2">
            Match questions with their correct answers
          </p>
        </motion.div>

        {/* Game grid displaying cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {shuffledPairs.map((item, index) => (
            <motion.div
              key={index}
              className={`
                cursor-pointer rounded-xl p-4 min-h-[120px] flex items-center justify-center text-center
                transition-all duration-300
                ${matchedPairs.includes(item.id) 
                  ? 'bg-emerald-900/20 border-emerald-500/50 shadow-emerald-500/10' 
                  : selectedPair.includes(index)
                    ? 'bg-cyan-900/20 border-cyan-500/50 shadow-cyan-500/10'
                    : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50'}
                border backdrop-blur-sm
              `}
              onClick={() => handleCardClick(index, item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className={`text-sm md:text-base ${
                matchedPairs.includes(item.id) 
                  ? 'text-emerald-200' 
                  : selectedPair.includes(index)
                    ? 'text-cyan-200'
                    : 'text-zinc-300'
              }`}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Reset game button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <Button
            onClick={resetGame}
            variant="ghost"
            className="text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900/20"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Reset Game
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
