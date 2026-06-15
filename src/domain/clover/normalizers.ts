import { CloverHintValidationError } from "@/domain/clover/errors";
import type {
  CloverHint,
  CloverHints,
  CloverHintTheme,
  CloverWordPair,
  CloverWordPairs,
} from "@/domain/clover/types";

// 入力された 4 辺分の単語ペアを、前後空白のない必須文字列に正規化する。
export const normalizeWordPairs = (pairs: CloverWordPairs): CloverWordPairs => [
  normalizeWordPair(pairs[0], 0),
  normalizeWordPair(pairs[1], 1),
  normalizeWordPair(pairs[2], 2),
  normalizeWordPair(pairs[3], 3),
];

const normalizeWordPair = (
  pair: CloverWordPair,
  pairIndex: number,
): CloverWordPair => {
  const firstWord = normalizeRequiredText(
    pair.words[0],
    `pairs[${pairIndex}].words[0]`,
  );
  const secondWord = normalizeRequiredText(
    pair.words[1],
    `pairs[${pairIndex}].words[1]`,
  );

  return {
    side: pair.side,
    words: [firstWord, secondWord],
  };
};

// 任意テーマは空文字を null に寄せ、後続処理で未指定として扱えるようにする。
export const normalizeTheme = (
  theme: string | null | undefined,
): CloverHintTheme => {
  if (theme == null) {
    return null;
  }

  const normalizedTheme = theme.trim();

  return normalizedTheme.length > 0 ? normalizedTheme : null;
};

// 生成された 4 辺分の回答を、前後空白のない必須文字列に正規化する。
export const normalizeHints = (hints: CloverHints): CloverHints => [
  normalizeHint(hints[0], 0),
  normalizeHint(hints[1], 1),
  normalizeHint(hints[2], 2),
  normalizeHint(hints[3], 3),
];

const normalizeHint = (hint: CloverHint, hintIndex: number): CloverHint => ({
  side: hint.side,
  text: normalizeRequiredText(hint.text, `hints[${hintIndex}].text`),
});

const normalizeRequiredText = (value: string, fieldName: string): string => {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new CloverHintValidationError(`${fieldName} は必須です。`);
  }

  return normalizedValue;
};
