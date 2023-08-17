import React from 'react';
import { CARD_COVER } from '../../../gameAPI';
import './index.css';

const Card = ({ card, handleChoice, flipped, disabled }) => {
  return (
    <div className="scene">
      <div className={`card ${flipped && 'is-flipped'}`}>
        <img
          src={card.src}
          alt="card-front"
          className="card__face card__face--front"
        />
        <img
          src={CARD_COVER}
          alt="card-back"
          className="card__face card__face--back"
          onClick={() => !disabled && handleChoice(card)}
        />
      </div>
    </div>
  );
};

const Board = ({ cards, handleChoice, choiceOne, choiceTwo, disabled }) => {
  return (
    <div className="board">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          handleChoice={handleChoice}
          flipped={card === choiceOne || card === choiceTwo || card.matched}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default Board;
