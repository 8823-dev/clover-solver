const cardIndexes = [0, 1, 2, 3];

function CloverCard() {
  return (
    <div className="clover-card">
      <svg
        className="clover-card__mark"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="clover-card__mark-shape"
          d="M8 8 C28 31 39 25 50 35 C61 25 72 31 92 8 C69 28 75 39 65 50 C75 61 69 72 92 92 C72 69 61 75 50 65 C39 75 28 69 8 92 C31 72 25 61 35 50 C25 39 31 28 8 8Z"
        />
      </svg>
      <div className="clover-card__hole" aria-hidden="true" />
    </div>
  );
}

export function CloverBoard() {
  return (
    <section className="clover-board" aria-label="ことばのクローバー！ボード">
      <div className="clover-board__petal clover-board__petal--top-left" />
      <div className="clover-board__petal clover-board__petal--top-right" />
      <div className="clover-board__petal clover-board__petal--right-top" />
      <div className="clover-board__petal clover-board__petal--right-bottom" />
      <div className="clover-board__petal clover-board__petal--bottom-right" />
      <div className="clover-board__petal clover-board__petal--bottom-left" />
      <div className="clover-board__petal clover-board__petal--left-bottom" />
      <div className="clover-board__petal clover-board__petal--left-top" />
      <div className="clover-board__core" />

      <div className="clover-board__cards">
        {cardIndexes.map((index) => (
          <CloverCard key={index} />
        ))}
      </div>
    </section>
  );
}
