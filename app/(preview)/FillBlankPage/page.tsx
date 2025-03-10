"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCw, ArrowRight, ChevronLeft } from "lucide-react";
import { useAppContext } from "../../context/context";
import { useRouter } from "next/navigation";

// Define question structure
interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function FillBlankPage() {
  // State management
  const [selectedCards, setSelectedCards] = useState<string[]>([]); // Track selected answer cards
  const [fixedCards, setFixedCards] = useState<string[]>([]); // Track correctly answered cards
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const { title, questions } = useAppContext();
  const router = useRouter();

  // Fetch fill-in-the-blank question on component mount
  useEffect(() => {
    const getFillInTheBlanks = async () => {
      try {
        const response = await fetch("/api/get-fillintheblanks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch question");
        }

        const data = await response.json();
        setCurrentQuestion(data);
      } catch (error) {
        console.error("Error fetching question:", error);
        router.push("/");
      }
    };

    if (questions?.length) {
      getFillInTheBlanks();
    }
  }, [questions, router]);

  // Handle card selection logic
  const handleCardClick = (word: string) => {
    if (selectedCards.includes(word)) {
      // Deselect card if already selected
      setSelectedCards(selectedCards.filter(w => w !== word));
    } else {
      // Manage selection of up to 2 cards
      if (selectedCards.length === 2) {
        setSelectedCards([selectedCards[1], word]);
      } else {
        setSelectedCards([...selectedCards, word]);
      }

      // Check if selected cards match the answer
      if (currentQuestion?.answer) {
        const answers = currentQuestion.answer.split(" ");
        const newSelected = selectedCards.length === 2 ? [selectedCards[1], word] : [...selectedCards, word];
        
        if (newSelected.length === 2 && answers.every(answer => newSelected.includes(answer))) {
          setFixedCards(answers);
        }
      }
    }
  };

  // Verify if selected cards match the answer
  const checkAnswer = () => {
    if (!currentQuestion?.answer || !selectedCards.length) return false;
    
    return selectedCards.length === 2 && 
           currentQuestion.answer.split(" ").every(word => selectedCards.includes(word));
  };

  // Reset game and fetch new question
  const resetGame = async () => {
    setSelectedCards([]);
    setFixedCards([]);
    try {
      const response = await fetch("/api/get-fillintheblanks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await response.json();
      setCurrentQuestion(data);
    } catch (error) {
      console.error("Error fetching new question:", error);
    }
  };

  // UI Rendering
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-100"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            {title || "Fill in the Blanks"}
          </h2>
          <p className="text-xl text-zinc-400 mt-2">
            Select two cards to fill in the missing words
          </p>
        </motion.div>

        {/* Game Content */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
            {/* Question Display */}
            <p className="text-zinc-300 mb-4 text-lg text-center">
              {currentQuestion?.question || "Loading question..."}
            </p>
            
            {/* Answer Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {currentQuestion?.options.map((word, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer p-4 rounded-xl text-center transition-all duration-300
                    ${selectedCards.includes(word)
                      ? checkAnswer()
                        ? 'bg-green-900/30 border-green-500/50 shadow-green-500/10'
                        : 'bg-purple-900/30 border-purple-500/50 shadow-purple-500/10'
                      : 'bg-zinc-900/50 border-zinc-700/50 hover:border-zinc-600/50'}
                    border backdrop-blur-sm`}
                  onClick={() => !fixedCards.includes(word) && handleCardClick(word)}
                  whileHover={{ scale: fixedCards.includes(word) ? 1 : 1.05 }}
                  whileTap={{ scale: fixedCards.includes(word) ? 1 : 0.95 }}
                >
                  <p className={`text-sm md:text-base ${
                    selectedCards.includes(word)
                      ? checkAnswer()
                        ? 'text-green-200'
                        : 'text-purple-200'
                      : 'text-zinc-300'
                  }`}>
                    {word}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Feedback Message */}
            {selectedCards.length === 2 && (
              <div className={`mt-6 text-center text-lg ${
                checkAnswer() ? 'text-green-400' : 'text-red-400'
              }`}>
                {checkAnswer() ? 'Correct!' : 'Try again!'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Control Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8 gap-4"
        >
          <Button
            onClick={resetGame}
            variant="ghost"
            className="text-purple-400 hover:text-purple-100 hover:bg-purple-900/20"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Reset Game
          </Button>

          {checkAnswer() && (
            <Button
              onClick={resetGame}
              variant="ghost" 
              className="text-green-400 hover:text-green-100 hover:bg-green-900/20"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Next Question
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
