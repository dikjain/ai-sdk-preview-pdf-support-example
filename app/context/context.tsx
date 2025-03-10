"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ContextState {
  questions: Array<{
    question: string;
    answer: string;
  }>;
  setQuestions: (questions: Array<{question: string; answer: string}>) => void;
  title: string | undefined;
  setTitle: (title: string | undefined) => void;
  points: number;
  setPoints: (points: number) => void;
    }

const initialState: ContextState = {
  questions: [],
  points: 0,
  setQuestions: () => {},
  setPoints: () => {},
  title: undefined,
  setTitle: () => {}
};

const AppContext = createContext<ContextState>(initialState);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Array<{question: string; answer: string}>>([]);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [pdfData , setPdfData] =useState("")
  const [ points , setPoints ] = useState(0)


  useEffect(()=>{
    console.log(questions)
  },[questions])

  return (
    <AppContext.Provider value={{
      questions,
      setQuestions,
      title,
      setTitle,
      points,
      setPoints
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
