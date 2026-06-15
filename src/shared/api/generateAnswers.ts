import {
  cloverSides,
  type CloverHint,
  type CloverHints,
  type CloverSide,
  type CloverWordPair,
  type CloverWordPairs,
} from "@/domain/clover/types";

export type GenerateAnswersRequest = {
  readonly pairs: CloverWordPairs;
  readonly theme?: string | null;
};

export type GenerateAnswersSuccessResponse = {
  readonly hints: CloverHints;
};

export type GenerateAnswersErrorCode =
  | "INVALID_JSON"
  | "VALIDATION_ERROR"
  | "SERVER_CONFIGURATION_ERROR"
  | "OPENAI_REQUEST_ERROR"
  | "OPENAI_RESPONSE_ERROR"
  | "INTERNAL_SERVER_ERROR";

export type GenerateAnswersErrorResponse = {
  readonly error: {
    readonly code: GenerateAnswersErrorCode;
    readonly message: string;
  };
};

export type GenerateAnswersResponse =
  | GenerateAnswersSuccessResponse
  | GenerateAnswersErrorResponse;

type ParseSuccess<T> = {
  readonly ok: true;
  readonly value: T;
};

type ParseFailure = {
  readonly ok: false;
  readonly message: string;
};

type ParseResult<T> = ParseSuccess<T> | ParseFailure;

type ParseGenerateAnswersRequestResult = ParseResult<GenerateAnswersRequest>;

const sideLabels: Record<CloverSide, string> = {
  top: "上",
  right: "右",
  bottom: "下",
  left: "左",
};

export const parseGenerateAnswersRequest = (
  value: unknown,
): ParseGenerateAnswersRequestResult => {
  if (!isRecord(value)) {
    return {
      ok: false,
      message: "リクエスト body はオブジェクトである必要があります。",
    };
  }

  const pairsResult = parseWordPairs(value.pairs);

  if (!pairsResult.ok) {
    return pairsResult;
  }

  const themeResult = parseTheme(value.theme);

  if (!themeResult.ok) {
    return themeResult;
  }

  return {
    ok: true,
    value: {
      pairs: pairsResult.value,
      theme: themeResult.value,
    },
  };
};

const parseWordPairs = (
  value: unknown,
): ParseResult<CloverWordPairs> => {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      message: "pairs は配列である必要があります。",
    };
  }

  if (value.length !== cloverSides.length) {
    return {
      ok: false,
      message: "pairs は 4 件である必要があります。",
    };
  }

  const pairs = value.map(parseWordPair);
  const invalidPair = pairs.find((pair) => !pair.ok);

  if (invalidPair != null && !invalidPair.ok) {
    return invalidPair;
  }

  const validPairs = pairs.filter((pair) => pair.ok).map((pair) => pair.value);
  const missingSide = cloverSides.find(
    (side) => !validPairs.some((pair) => pair.side === side),
  );

  if (missingSide != null) {
    return {
      ok: false,
      message: `pairs に ${sideLabels[missingSide]} の単語ペアが含まれていません。`,
    };
  }

  return {
    ok: true,
    value: [
      findWordPairBySide(validPairs, "top"),
      findWordPairBySide(validPairs, "right"),
      findWordPairBySide(validPairs, "bottom"),
      findWordPairBySide(validPairs, "left"),
    ],
  };
};

const parseWordPair = (
  value: unknown,
): ParseResult<CloverWordPair> => {
  if (!isRecord(value)) {
    return {
      ok: false,
      message: "単語ペアはオブジェクトである必要があります。",
    };
  }

  if (!isCloverSide(value.side)) {
    return {
      ok: false,
      message: "単語ペアの side が不正です。",
    };
  }

  if (!Array.isArray(value.words) || value.words.length !== 2) {
    return {
      ok: false,
      message: "単語ペアの words は 2 件の配列である必要があります。",
    };
  }

  const firstWord = parseRequiredString(value.words[0]);
  const secondWord = parseRequiredString(value.words[1]);

  if (firstWord == null || secondWord == null) {
    return {
      ok: false,
      message: "単語ペアの words には未入力の単語を含められません。",
    };
  }

  return {
    ok: true,
    value: {
      side: value.side,
      words: [firstWord, secondWord],
    },
  };
};

const parseTheme = (
  value: unknown,
): ParseResult<string | null> => {
  if (value == null) {
    return {
      ok: true,
      value: null,
    };
  }

  if (typeof value !== "string") {
    return {
      ok: false,
      message: "theme は文字列または null である必要があります。",
    };
  }

  const theme = value.trim();

  return {
    ok: true,
    value: theme.length > 0 ? theme : null,
  };
};

const parseRequiredString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

const findWordPairBySide = (
  pairs: readonly CloverWordPair[],
  side: CloverSide,
): CloverWordPair => {
  const pair = pairs.find((candidate) => candidate.side === side);

  if (pair == null) {
    throw new Error(`${sideLabels[side]} の単語ペアが見つかりません。`);
  }

  return pair;
};

const isCloverSide = (value: unknown): value is CloverSide =>
  typeof value === "string" &&
  cloverSides.some((side) => side === value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const createGenerateAnswersSuccessResponse = (
  hints: readonly CloverHint[],
): GenerateAnswersSuccessResponse => ({
  hints: [
    findHintBySide(hints, "top"),
    findHintBySide(hints, "right"),
    findHintBySide(hints, "bottom"),
    findHintBySide(hints, "left"),
  ],
});

const findHintBySide = (
  hints: readonly CloverHint[],
  side: CloverSide,
): CloverHint => {
  const hint = hints.find((candidate) => candidate.side === side);

  if (hint == null) {
    throw new Error(`${sideLabels[side]} の回答が見つかりません。`);
  }

  return hint;
};
