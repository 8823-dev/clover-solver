export const cloverSides = ["top", "right", "bottom", "left"] as const;

export type CloverSide = (typeof cloverSides)[number];

export type FixedFour<T> = readonly [T, T, T, T];

export type CloverWordPair = {
  readonly side: CloverSide;
  readonly words: readonly [string, string];
};

export type CloverWordPairs = FixedFour<CloverWordPair>;

export type CloverHint = {
  readonly side: CloverSide;
  readonly text: string;
};

export type CloverHints = FixedFour<CloverHint>;

export type CloverHintTheme = string | null;

export type GenerateCloverHintsInput = {
  readonly pairs: CloverWordPairs;
  readonly theme?: string | null;
};

export type GenerateCloverHintsOutput = {
  readonly hints: CloverHints;
};

