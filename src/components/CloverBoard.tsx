const cardIndexes = [0, 1, 2, 3];

function CloverCard() {
  return (
    <div className="clover-card" aria-hidden="true">
      <div className="clover-card__mark">
        <div className="clover-card__hole" />
      </div>
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
