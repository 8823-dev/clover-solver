import Image from "next/image";

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

type CloverBoardProps = {
  values: Record<WordSlotId, string>;
  onWordChange: (id: WordSlotId, value: string) => void;
};

export function CloverBoard({ values, onWordChange }: CloverBoardProps) {
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
    </section>
  );
}
