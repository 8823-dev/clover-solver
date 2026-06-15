import type { CloverHintGenerator } from "@/application/ports/CloverHintGenerator";
import {
  normalizeHints,
  normalizeTheme,
  normalizeWordPairs,
} from "@/domain/clover/normalizers";
import type {
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
