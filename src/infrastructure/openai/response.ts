import { normalizeHints } from "@/domain/clover/normalizers";
import {
  cloverSides,
  type CloverHint,
  type CloverHints,
  type CloverSide,
} from "@/domain/clover/types";
import { OpenAIResponseParseError } from "@/infrastructure/openai/errors";

type ParsedCloverHintsResponse = {
  readonly hints: CloverHints;
};

export const parseCloverHintsFromOpenAIResponse = (
  responseBody: unknown,
): ParsedCloverHintsResponse => {
  const outputText = extractOutputText(responseBody);
  const parsedJson = parseJson(outputText);
  const hints = parseHints(parsedJson);

  try {
    return {
      hints: normalizeHints(hints),
    };
  } catch (error) {
    throw new OpenAIResponseParseError(
      error instanceof Error
        ? `OpenAI response validation failed: ${error.message}`
        : "OpenAI response validation failed.",
    );
  }
};

const extractOutputText = (responseBody: unknown): string => {
  if (!isRecord(responseBody)) {
    throw new OpenAIResponseParseError("OpenAI response body is not an object.");
  }

  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  if (!Array.isArray(responseBody.output)) {
    throw new OpenAIResponseParseError(
      "OpenAI response does not include output text.",
    );
  }

  const outputText = responseBody.output
    .flatMap((item) => extractTextFromOutputItem(item))
    .join("");

  if (outputText.trim().length === 0) {
    throw new OpenAIResponseParseError("OpenAI response text is empty.");
  }

  return outputText;
};

const extractTextFromOutputItem = (item: unknown): readonly string[] => {
  if (!isRecord(item) || !Array.isArray(item.content)) {
    return [];
  }

  return item.content.flatMap((contentItem) => {
    if (!isRecord(contentItem)) {
      return [];
    }

    return typeof contentItem.text === "string" ? [contentItem.text] : [];
  });
};

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    throw new OpenAIResponseParseError("OpenAI response text is not valid JSON.");
  }
};

const parseHints = (value: unknown): CloverHints => {
  if (!isRecord(value) || !Array.isArray(value.hints)) {
    throw new OpenAIResponseParseError(
      "OpenAI response JSON does not include hints.",
    );
  }

  const hints = value.hints.map(parseHint);

  if (hints.length !== cloverSides.length) {
    throw new OpenAIResponseParseError(
      "OpenAI response must include exactly 4 hints.",
    );
  }

  return [
    findHintBySide(hints, "top"),
    findHintBySide(hints, "right"),
    findHintBySide(hints, "bottom"),
    findHintBySide(hints, "left"),
  ];
};

const findHintBySide = (
  hints: readonly CloverHint[],
  side: CloverSide,
): CloverHint => {
  const hint = hints.find((candidate) => candidate.side === side);

  if (hint == null) {
    throw new OpenAIResponseParseError(
      `OpenAI response is missing ${side} hint.`,
    );
  }

  return hint;
};

const parseHint = (value: unknown): CloverHint => {
  if (!isRecord(value)) {
    throw new OpenAIResponseParseError("OpenAI response hint is not an object.");
  }

  if (!isCloverSide(value.side)) {
    throw new OpenAIResponseParseError("OpenAI response hint side is invalid.");
  }

  if (typeof value.text !== "string") {
    throw new OpenAIResponseParseError("OpenAI response hint text is invalid.");
  }

  return {
    side: value.side,
    text: value.text,
  };
};

const isCloverSide = (value: unknown): value is CloverSide =>
  typeof value === "string" &&
  cloverSides.some((side) => side === value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
