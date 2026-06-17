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
  values: Record<WordSlotId, string>;
  onWordChange: (id: WordSlotId, value: string) => void;
};

export const CloverBoard = ({
  hints,
  values,
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
        {wordSlots.map((slot, index) => (
          <input
            key={slot.id}
            className={`clover-board__input ${slot.className}`}
            name={slot.id}
            type="text"
            required
            value={values[slot.id]}
            onChange={(event) => onWordChange(slot.id, event.target.value)}
            placeholder={`単語 ${index + 1}`}
            aria-label={`単語 ${index + 1}`}
          />
        ))}
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
    </section>
  );
};

const findHintText = (
  hints: readonly CloverHint[] | null,
  side: CloverSide,
): string => hints?.find((hint) => hint.side === side)?.text ?? "";
