import Image from "next/image";
import type { CloverHint, CloverHints, CloverSide } from "@/domain/clover";

const wordSlots = [
  { id: "top-left", className: "clover-board__input--top-left" },
  { id: "top-right", className: "clover-board__input--top-right" },
  { id: "right-top", className: "clover-board__input--right-top" },
  { id: "right-bottom", className: "clover-board__input--right-bottom" },
  { id: "bottom-right", className: "clover-board__input--bottom-right" },
  { id: "bottom-left", className: "clover-board__input--bottom-left" },
  { id: "left-bottom", className: "clover-board__input--left-bottom" },
  { id: "left-top", className: "clover-board__input--left-top" },
] as const;

export type WordSlotId = (typeof wordSlots)[number]["id"];

export const wordSlotIds = wordSlots.map((slot) => slot.id);

const hintSlots = [
  { side: "top", label: "上", className: "clover-board__hint--top" },
  { side: "right", label: "右", className: "clover-board__hint--right" },
  { side: "bottom", label: "下", className: "clover-board__hint--bottom" },
  { side: "left", label: "左", className: "clover-board__hint--left" },
] as const satisfies readonly {
  readonly side: CloverSide;
  readonly label: string;
  readonly className: string;
}[];

type CloverBoardProps = {
  hints: CloverHints | null;
  isResetDisabled: boolean;
  values: Record<WordSlotId, string>;
  onReset: () => void;
  onWordChange: (id: WordSlotId, value: string) => void;
};

export const CloverBoard = ({
  hints,
  isResetDisabled,
  values,
  onReset,
  onWordChange,
}: CloverBoardProps) => {
  return (
    <section className="clover-board" aria-label="ことばのクローバー！ボード">
      <Image
        src="/clover-board-transparent.png"
        alt="ことばのクローバー！のクローバーボード"
        fill
        priority
        unoptimized
        sizes="(max-width: 640px) 94vw, 760px"
        className="clover-board__image"
      />

      <form className="clover-board__form" aria-label="キーワード入力">
        {wordSlots.map((slot, index) => {
          const value = values[slot.id];
          const fontSize = getWordInputFontSize(value);

          return (
            <input
              key={slot.id}
              className={`clover-board__input ${slot.className}`}
              name={slot.id}
              type="text"
              required
              style={{ fontSize }}
              value={value}
              onChange={(event) => onWordChange(slot.id, event.target.value)}
              placeholder={`単語 ${index + 1}`}
              aria-label={`単語 ${index + 1}`}
            />
          );
        })}
      </form>

      <div className="clover-board__hints" aria-label="生成された回答">
        {hintSlots.map((slot) => {
          const hintText = findHintText(hints, slot.side);

          return (
            <output
              key={slot.side}
              className={`clover-board__hint ${slot.className}`}
              aria-label={`${slot.label}の回答`}
            >
              <span className="clover-board__hint-text">{hintText}</span>
            </output>
          );
        })}
      </div>

      <button
        className="clover-board__reset-button"
        type="button"
        disabled={isResetDisabled}
        onClick={onReset}
        aria-label="単語と生成した回答を初期化"
      >
        <Image
          src="/refresh.png"
          alt=""
          width={96}
          height={96}
          unoptimized
          className="clover-board__reset-icon"
        />
      </button>
    </section>
  );
};

const findHintText = (
  hints: readonly CloverHint[] | null,
  side: CloverSide,
): string => hints?.find((hint) => hint.side === side)?.text ?? "";

const getWordInputFontSize = (value: string): string => {
  const wordLength = Array.from(value.trim()).length;

  if (wordLength >= 12) {
    return "clamp(8px, 1vw, 9px)";
  }

  if (wordLength >= 10) {
    return "clamp(9px, 1.25vw, 11px)";
  }

  if (wordLength >= 8) {
    return "clamp(11px, 1.45vw, 13px)";
  }

  if (wordLength >= 6) {
    return "clamp(13px, 1.65vw, 16px)";
  }

  return "clamp(15px, 2vw, 20px)";
};
