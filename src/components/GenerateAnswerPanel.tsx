"use client";

import { useState } from "react";

export function GenerateAnswerPanel() {
  const [theme, setTheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsGenerating(false);
  };

  return (
    <aside className="generate-panel" aria-label="回答生成">
      <div className="generate-panel__options">
        <label className="generate-panel__label" htmlFor="theme">
          テーマを指定（任意）
        </label>
        <input
          id="theme"
          className="generate-panel__theme-input"
          type="text"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          placeholder="例: 倫理違反、アニメ"
        />
      </div>

      <button
        className="generate-panel__button"
        type="button"
        disabled={isGenerating}
        onClick={handleGenerate}
      >
        {isGenerating ? "生成中" : "回答を生成"}
      </button>

      <div className="generate-panel__status" role="status" aria-live="polite">
        {isGenerating ? (
          <>
            <span className="generate-panel__spinner" aria-hidden="true" />
            回答を生成中
          </>
        ) : null}
      </div>
    </aside>
  );
}
