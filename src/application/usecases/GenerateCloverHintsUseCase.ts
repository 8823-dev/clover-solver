import type { CloverHintGenerator } from "@/application/ports/CloverHintGenerator";
import { CloverHintValidationError } from "@/domain/clover/errors";
import type {
  CloverHint,
  CloverHints,
  CloverHintTheme,
  CloverWordPair,
  CloverWordPairs,
  GenerateCloverHintsInput,
  GenerateCloverHintsOutput,
} from "@/domain/clover/types";

export class GenerateCloverHintsUseCase {
  constructor(private readonly cloverHintGenerator: CloverHintGenerator) {}

  async execute(
    input: GenerateCloverHintsInput,
  ): Promise<GenerateCloverHintsOutput> {
    const request = {
      pairs: normalizeWordPairs(input.pairs),
      theme: normalizeTheme(input.theme),
    };

    const result = await this.cloverHintGenerator.generate(request);

    return {
      hints: normalizeHints(result.hints),
    };
  }
}

const normalizeWordPairs = (pairs: CloverWordPairs): CloverWordPairs => [
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

const normalizeTheme = (theme: string | null | undefined): CloverHintTheme => {
  if (theme == null) {
    return null;
  }

  const normalizedTheme = theme.trim();

  return normalizedTheme.length > 0 ? normalizedTheme : null;
};

const normalizeHints = (hints: CloverHints): CloverHints => [
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
    throw new CloverHintValidationError(`${fieldName} is required.`);
  }

  return normalizedValue;
};

