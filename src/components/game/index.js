import React, { useState, useCallback, useEffect, useRef } from 'react';
import './index.css';
import { generateCards } from '../../gameAPI';
import Board from './board';

const Game = ({ amount, setAmmount }) => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const balloonContainer = useRef(null);

  const shuffleCards = useCallback(() => {
    const generatedCards = generateCards(amount);
    const shuffledCards = generatedCards.sort(() => Math.random() - 0.5);
    setChoiceOne(null);
    setChoiceTwo(null);
    setGameOver(false);
    if (turns > 0) {
      removeBalloons();
    }
    setCards(shuffledCards);
    setTurns(0);
  }, [amount, turns]);

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          );
        });
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const random = (num) => {
    return Math.floor(Math.random() * num);
  };

  const getRandomStyles = () => {
    var r = random(255);
    var g = random(255);
    var b = random(255);
    var mt = random(200);
    var ml = random(50);
    var dur = random(5) + 5;
    return `
    background-color: rgba(${r},${g},${b},0.7);
    color: rgba(${r},${g},${b},0.7); 
    box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
    margin: ${mt}px 0 0 ${ml}px;
    animation: float ${dur}s ease-in infinite
    `;
  };

  const createBalloons = (num) => {
    const container = document.createElement('div');
    container.className = 'container';
    for (let i = num; i > 0; i--) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      balloon.style.cssText = getRandomStyles();
      container.append(balloon);
    }
    balloonContainer.current.append(container);
  };

  const removeBalloons = () => {
    const container = document.querySelector('.container');
    if (!container) return;
    setTimeout(() => {
      balloonContainer.current.removeChild(container);
    }, [200]);
  };

  useEffect(() => {
    if (cards.every((card) => card.matched) && cards.length > 0) {
      setGameOver(true);
      createBalloons(30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const menu = () => {
    setAmmount(null);
  };

  return (
    <div className="game balloon-container" ref={balloonContainer}>
      <>
        <h1>Memory Game</h1>
        <div className="options">
          <button onClick={menu}>⬅️ Menu</button>
          <button onClick={shuffleCards}>New Game</button>
        </div>
        {!gameOver ? (
          <p>Turns: {turns}</p>
        ) : (
          <>
            <p>Game Over</p>
            <p>Total turns: {turns}</p>
          </>
        )}
      </>
      <Board
        cards={cards}
        handleChoice={handleChoice}
        turns={turns}
        choiceOne={choiceOne}
        choiceTwo={choiceTwo}
        disabled={disabled}
      />
    </div>
  );
};

export default Game;
