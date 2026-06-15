import type { CloverHintGenerationRequest } from "@/application/ports/CloverHintGenerator";

const sideLabels = {
  top: "上",
  right: "右",
  bottom: "下",
  left: "左",
} as const;

export const buildCloverHintPrompt = (
  request: CloverHintGenerationRequest,
): string => {
  const themeInstruction =
    request.theme == null
      ? "テーマ指定はありません。"
      : `テーマ: ${request.theme}`;

  const pairsText = request.pairs
    .map(
      (pair) =>
        `- ${sideLabels[pair.side]}: 「${pair.words[0]}」と「${pair.words[1]}」`,
    )
    .join("\n");

  return [
    "「ことばのクローバー！」のヒントを生成してください。",
    "各辺について、2 つの単語に共通する特徴・連想・カテゴリを、日本語の短い単語または短い語句で 1 件ずつ作成してください。",
    "答えそのものを直接含めず、推測の手がかりとして自然な表現にしてください。",
    themeInstruction,
    "",
    "単語ペア:",
    pairsText,
  ].join("\n");
};

export const cloverHintDeveloperMessage = [
  "あなたはボードゲーム「ことばのクローバー！」の模範回答を作るアシスタントです。",
  "必ず指定された JSON Schema に従い、top / right / bottom / left の 4 辺すべてに回答を返してください。",
].join("\n");

