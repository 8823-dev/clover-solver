"use client";

import { useState } from "react";
import {
  CloverBoard,
  type WordSlotId,
  wordSlotIds,
} from "@/components/CloverBoard";
import { GenerateAnswerPanel } from "@/components/GenerateAnswerPanel";
import type {
  GenerateAnswersRequest,
  GenerateAnswersResponse,
  GenerateAnswersSuccessResponse,
} from "@/shared/api/generateAnswers";

type WordValues = Record<WordSlotId, string>;

const initialWordValues = Object.fromEntries(
  wordSlotIds.map((id) => [id, ""]),
) as WordValues;

const generateAnswersErrorMessage = "回答生成に失敗しました";

export const CloverSolver = () => {
  const [wordValues, setWordValues] = useState<WordValues>(initialWordValues);
  const [generatedHints, setGeneratedHints] =
    useState<GenerateAnswersSuccessResponse["hints"] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationErrorMessage, setGenerationErrorMessage] = useState<
    string | null
  >(null);

  const hasMissingWords = wordSlotIds.some(
    (id) => wordValues[id].trim().length === 0,
  );

  const handleWordChange = (id: WordSlotId, value: string) => {
    setWordValues((currentValues) => ({
      ...currentValues,
      [id]: value,
    }));
    setGenerationErrorMessage(null);
    setGeneratedHints(null);
  };

  const handleGenerateAnswers = async (theme: string) => {
    setIsGenerating(true);
    setGenerationErrorMessage(null);

    try {
      const response = await fetch("/api/generate-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createGenerateAnswersRequest(wordValues, theme)),
      });
      const responseBody = (await response.json()) as GenerateAnswersResponse;

      if (!response.ok || "error" in responseBody) {
        setGenerationErrorMessage(generateAnswersErrorMessage);
        return;
      }

      setGeneratedHints(responseBody.hints);
    } catch {
      setGenerationErrorMessage(generateAnswersErrorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="solver-layout mx-auto min-h-[calc(100vh-2rem)] w-full max-w-6xl">
      <CloverBoard
        hints={generatedHints}
        values={wordValues}
        onWordChange={handleWordChange}
      />
      <GenerateAnswerPanel
        errorMessage={generationErrorMessage}
        hasMissingWords={hasMissingWords}
        isGenerating={isGenerating}
        onGenerate={handleGenerateAnswers}
      />
    </main>
  );
};

const createGenerateAnswersRequest = (
  wordValues: WordValues,
  theme: string,
): GenerateAnswersRequest => ({
  pairs: [
    {
      side: "top",
      words: [wordValues["top-left"], wordValues["top-right"]],
    },
    {
      side: "right",
      words: [wordValues["right-top"], wordValues["right-bottom"]],
    },
    {
      side: "bottom",
      words: [wordValues["bottom-right"], wordValues["bottom-left"]],
    },
    {
      side: "left",
      words: [wordValues["left-bottom"], wordValues["left-top"]],
    },
  ],
  theme,
});
