"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Modes from "@/app/(preview)/modes";
import { useRouter } from "next/navigation";

export default function CardsPage() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");
  const router = useRouter();

  const handleSelectMode = async (mode: "quiz" | "flashcards" | "matching" | null) => {
    if (!fileId) return;

    switch (mode) {
      case "flashcards":
        router.push(`/FlashCardsPage?fileId=${fileId}`);
        break;
      case "quiz":
        router.push(`/MatchingPage?fileId=${fileId}`);
        break;
      case "matching":
        router.push(`/FillBlankPage?fileId=${fileId}`);
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 via-zinc-900/80 to-black" />
      <div className="relative z-10 h-screen">
        <Modes
          title="Choose Your Learning Mode"
          onSelectMode={handleSelectMode}
          onReset={() => {}}
        />
      </div>
    </div>
  );
}