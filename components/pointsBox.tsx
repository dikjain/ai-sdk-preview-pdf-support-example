"use client";

import { motion } from "framer-motion";
import { useAppContext } from "../app/context/context";
import { Sparkles } from "lucide-react";

export default function PointsBox() {
  const { points } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 right-4 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4 text-yellow-400" />
      <span className="text-white font-medium">
        {points} Points
      </span>
    </motion.div>
  );
}
