"use client";

// Core React and Next.js imports
import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

// Schema and validation
import { questionsSchema } from "@/lib/schemas";
import { z } from "zod";

// UI Components and utilities
import { toast } from "sonner";
import { FileUp, Plus, Loader2, ListChecks, BrainCircuit, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import { Link } from "@/components/ui/link";
import { VercelIcon, GitIcon } from "@/components/icons";

// Animation
import { AnimatePresence, motion, useAnimation } from "framer-motion";

// App specific
import { generateQuizTitle } from "./actions";
import { useAppContext } from "../context/context";

type LearningMode = "quiz" | "flashcards" | "matching" | null;

export default function ChatWithFiles() {
  // State management
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  
  // Hooks
  const router = useRouter();
  const controls = useAnimation();
  const { setQuestions: setContextQuestions, setTitle: setContextTitle } = useAppContext();

  // Quiz generation handling with error management and completion
  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
      if (object?.length === 4) {
        setContextQuestions(object);
        setContextTitle(title);
        router.push('/CardPage');
      }
    },
  });

  // File handling functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Safari compatibility check
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari && isDragging) {
      toast.error("Safari does not support drag & drop. Please use the file picker.");
      return;
    }

    // File validation
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    // Animation and state update
    controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    });
    setFiles(validFiles);
  };

  // File encoding helper
  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Form submission handler
  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );
    submit({ files: encodedFiles });
    const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
    setTitle(generatedTitle);
  };

  // Utility functions
  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
  };

  // Progress calculation
  const progress = partialQuestions ? (partialQuestions.length / 4) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      {/* Drag and drop overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed inset-0 pointer-events-none bg-black/60 backdrop-blur-lg flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Upload className="h-20 w-20 text-white" />
              </motion.div>
              <div className="text-3xl font-bold text-white glow">
                Drop your PDF here
              </div>
              <div className="text-white/80">Files up to 5MB supported</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl px-4 relative"
      >
        {/* Decorative background elements */}
        <motion.div 
          className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] "
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full blur-[100px] "
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 4,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Header section */}
        <div className="text-center mb-12 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-bold text-white glow mb-4">
              PDF Quiz Generator
              <motion.div
                className="h-1 mt-2 w-[80%] mx-auto rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                animate={{
                  backgroundColor: [
                    "rgb(59, 130, 246)", 
                    "rgb(139, 92, 246)", 
                    "rgb(236, 72, 153)", 
                    "rgb(59, 130, 246)" 
                  ],
                  boxShadow: [
                    "0 0 20px rgba(59,130,246,0.7)",
                    "0 0 20px rgba(139,92,246,0.7)",
                    "0 0 20px rgba(236,72,153,0.7)",
                    "0 0 20px rgba(59,130,246,0.7)"
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </h1>
            <p className="text-xl text-zinc-400">Transform any PDF into an interactive learning experience</p>
          </motion.div>
        </div>

        {/* File upload form */}
        <motion.form 
          onSubmit={handleSubmitWithFiles} 
          className="space-y-8"
          animate={controls}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-16 transition-all duration-200 backdrop-blur-lg ${
              isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-white/20 hover:border-white/40 bg-white/5'
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FileUp className="h-20 w-20 mb-6 text-white glow" />
            </motion.div>
            <p className="text-2xl text-white text-center">
              {files.length > 0 ? (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium flex items-center gap-2"
                >
                  <Sparkles className="text-yellow-400 glow" />
                  {files[0].name}
                </motion.span>
              ) : (
                <>
                  <span className="font-medium">Drop your PDF here</span>
                  <br />
                  <span className="text-base text-white/50">or click to browse</span>
                </>
              )}
            </p>
          </motion.div>

          {/* Submit button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full py-8 text-xl font-medium bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white transition-all duration-300 rounded-xl glow-sm"
              disabled={files.length === 0 || isLoading}
            >
              {isLoading ? (
                <motion.span 
                  className="flex items-center gap-3"
                  animate={{ opacity: [0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Creating Your Interactive Experience...</span>
                </motion.span>
              ) : (
                <span className="flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6" />
                  Generate Interactive Quiz
                </span>
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Loading progress indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Generation Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <motion.div
                className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-lg"
              >
                <motion.div
                  className="h-full bg-white/30"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </div>
            <div className="text-center text-white/60">
              {partialQuestions
                ? `Creating question ${partialQuestions.length + 1} of 4`
                : "Analyzing your PDF..."}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer links */}
      <motion.div
        className="fixed bottom-6 flex gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <NextLink
          target="_blank"
          href="https://github.com/vercel-labs/ai-sdk-preview-pdf-support"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-white/60 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-lg"
        >
          <GitIcon />
          View Source
        </NextLink>

        <NextLink
          target="_blank"
          href="https://vercel.com/templates/next.js/ai-quiz-generator"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-lg"
        >
          <VercelIcon size={14} />
          Deploy to Vercel
        </NextLink>
      </motion.div>
    </motion.div>
  );
}
