"use client";

import { useState } from "react";
import {
  CloverBoard,
  type WordSlotId,
  wordSlotIds,
} from "@/components/CloverBoard";
import { GenerateAnswerPanel } from "@/components/GenerateAnswerPanel";

type WordValues = Record<WordSlotId, string>;

const initialWordValues = wordSlotIds.reduce<WordValues>((values, id) => {
  values[id] = "";
  return values;
}, {} as WordValues);

export function CloverSolver() {
  const [wordValues, setWordValues] = useState<WordValues>(initialWordValues);

  const hasMissingWords = wordSlotIds.some(
    (id) => wordValues[id].trim().length === 0,
  );

  const handleWordChange = (id: WordSlotId, value: string) => {
    setWordValues((currentValues) => ({
      ...currentValues,
      [id]: value,
    }));
  };

  return (
    <main className="solver-layout mx-auto min-h-[calc(100vh-2rem)] w-full max-w-6xl">
      <CloverBoard values={wordValues} onWordChange={handleWordChange} />
      <GenerateAnswerPanel hasMissingWords={hasMissingWords} />
    </main>
  );
}
