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
  // OpenAI の raw response は unknown として受け、型を確認しながらドメイン型へ変換する。
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
        ? `OpenAI API レスポンスの検証に失敗しました: ${error.message}`
        : "OpenAI API レスポンスの検証に失敗しました。",
    );
  }
};

const extractOutputText = (responseBody: unknown): string => {
  if (!isRecord(responseBody)) {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの body がオブジェクトではありません。",
    );
  }

  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  // Responses API の出力構造に備え、output 配列内の text も fallback として読む。
  if (!Array.isArray(responseBody.output)) {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスに output text が含まれていません。",
    );
  }

  const outputText = responseBody.output
    .flatMap((item) => extractTextFromOutputItem(item))
    .join("");

  if (outputText.trim().length === 0) {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの text が空です。",
    );
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
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの text が有効な JSON ではありません。",
    );
  }
};

const parseHints = (value: unknown): CloverHints => {
  if (!isRecord(value) || !Array.isArray(value.hints)) {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの JSON に hints が含まれていません。",
    );
  }

  const hints = value.hints.map(parseHint);

  if (hints.length !== cloverSides.length) {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの hints は 4 件である必要があります。",
    );
  }

  // 後続処理で扱いやすいよう、回答はボードの辺順に並べ直す。
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
      `OpenAI API レスポンスに ${side} の hint が含まれていません。`,
    );
  }

  return hint;
};

const parseHint = (value: unknown): CloverHint => {
  if (!isRecord(value)) {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの hint がオブジェクトではありません。",
    );
  }

  if (!isCloverSide(value.side)) {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの hint side が不正です。",
    );
  }

  if (typeof value.text !== "string") {
    throw new OpenAIResponseParseError(
      "OpenAI API レスポンスの hint text が不正です。",
    );
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
