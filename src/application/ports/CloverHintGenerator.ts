import type {
  CloverHints,
  CloverHintTheme,
  CloverWordPairs,
} from "@/domain/clover/types";

export type CloverHintGenerationRequest = {
  readonly pairs: CloverWordPairs;
  readonly theme: CloverHintTheme;
};

export type CloverHintGenerationResult = {
  readonly hints: CloverHints;
};

export type CloverHintGenerator = {
  generate: (
    request: CloverHintGenerationRequest,
  ) => Promise<CloverHintGenerationResult>;
};

