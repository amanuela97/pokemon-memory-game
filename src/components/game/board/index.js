import React from "react";
import { CARD_COVER } from "../../../utils/helper";
import "./index.css";

const Card = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled && !card.matched) {
      handleChoice(card);
    }
  };
  return (
    <div className="scene">
      <div className={`card ${flipped && "is-flipped"}`}>
        <img
          src={card.value}
          alt="card-front"
          className="card__face card__face--front"
        />
        <img
          src={CARD_COVER}
          alt="card-back"
          className="card__face card__face--back"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

const Board = ({ cards, handleChoice, disabled }) => {
  return (
    <div className="board">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          handleChoice={handleChoice}
          flipped={card.isFlipped || card.matched}
          disabled={disabled || card.isFlipped || card.matched}
        />
      ))}
    </div>
  );
};

export default Board;
