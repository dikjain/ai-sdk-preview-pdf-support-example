"use client";

import { motion } from "framer-motion";
import { ListChecks, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type LearningMode = "quiz" | "flashcards" | "matching" | null;

interface ModesProps {
  title?: string;
  onSelectMode: (mode: LearningMode) => void;
  onReset: () => void;
}

export default function Modes({ title, onSelectMode, onReset }: ModesProps) {
  const router = useRouter();

  const modes = [
    {
      id: "quiz",
      title: "Multiple Choice Quiz",
      description: "Test your knowledge with interactive questions and get instant feedback",
      icon: <ListChecks className="h-12 w-12 text-blue-400 [filter:drop-shadow(0_0_12px_rgb(96_165_250_/_50%))]" />,
      onClick: () => {onSelectMode("quiz"); router.push("/MatchingPage")},
      colorClasses: {
        hover: "hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
        text: "text-blue-100",
        icon: "text-blue-400"
      }
    },
    {
      id: "flashcards", 
      title: "Flashcards",
      description: "Review concepts efficiently with digital flashcards and spaced repetition",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-violet-400/20 flex items-center justify-center [filter:drop-shadow(0_0_12px_rgb(167_139_250_/_50%))]">
          <span className="text-2xl text-violet-400">A</span>
        </div>
      ),
      onClick: () => {
        onSelectMode("flashcards");
        router.push("/FlashCardsPage");
      },
      colorClasses: {
        hover: "hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]",
        text: "text-violet-100",
        icon: "text-violet-400"
      }
    },
    {
      id: "matching",
      title: "Matching Game", 
      description: "Reinforce learning by matching related concepts in an engaging way",
      icon: <BrainCircuit className="h-12 w-12 text-emerald-400 [filter:drop-shadow(0_0_12px_rgb(52_211_153_/_50%))]" />,
      onClick: () => {onSelectMode("matching"); router.push("/FillBlankPage");},
      colorClasses: {
        hover: "hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]", 
        text: "text-emerald-100",
        icon: "text-emerald-400"
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 p-12 min-h-screen w-full bg-gradient-to-b from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-lg"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-violet-500 text-center max-w-2xl [text-shadow:_0_0_40px_rgb(96_165_250_/_40%)]"
      >
        {title ?? "Interactive Learning"}
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-zinc-300 text-center max-w-xl [text-shadow:_0_0_30px_rgb(161_161_170_/_30%)]"
      >
        Choose your learning mode:
      </motion.p>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-8"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {modes.map((mode) => (
          <motion.div
            key={mode.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Button
              onClick={mode.onClick}
              className={`w-full p-8 h-auto flex flex-col gap-4 bg-black border border-zinc-700/30 ${mode.colorClasses.hover}  hover:bg-black rounded-2xl shadow-[0_8px_40px_rgb(0_0_0_/_0.3)] transition-all duration-500 animate-pulse-subtle`}
            >
              {mode.icon}
              <span className={`text-2xl font-semibold ${mode.colorClasses.text} text-center [text-shadow:_0_0_30px_rgb(255_255_255_/_30%)]`}>
                {mode.title}
              </span>
              <span className="text-sm text-zinc-300 leading-relaxed text-center px-4 text-wrap [text-shadow:_0_0_15px_rgb(161_161_170_/_20%)]">
                {mode.description}
              </span>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button 
          onClick={() => {onReset(); router.push("/")}}
          variant="ghost" 
          className="text-zinc-400 hover:text-zinc-100 mt-8 transition-all duration-300 hover:shadow-[0_0_20px_rgb(161_161_170_/_20%)] [text-shadow:_0_0_15px_rgb(161_161_170_/_30%)]"
        >
          Upload Different PDF
        </Button>
      </motion.div>
    </motion.div>
  );
}
