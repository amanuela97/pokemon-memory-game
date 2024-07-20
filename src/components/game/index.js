import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import Board from "./board";
import usePartySocket from "partysocket/react";
import { useGameContext } from "../../utils/state";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const navigate = useNavigate();
  const { amountOfCards, setAmountOfCards } = useGameContext();
  const [cards, setCards] = useState([]);
  const [playerStates, setPlayerStates] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  let winner = useRef(null);
  const socket = usePartySocket({
    host: process.env.REACT_APP_HOST,
    room: `memory-game-${amountOfCards}`,
    onOpen() {
      console.log("connected");
    },
    onMessage(e) {
      const message = JSON.parse(e.data);
      //console.log("message", message);

      if (message.type === "GAME_STATE") {
        setCards(message.gameBoard);
        setCurrentTurn(message.currentTurn);
        setPlayerStates(message.playerStates);
        if (!currentPlayerId) setCurrentPlayerId(message.playerId);
        if (choiceOne && choiceTwo) {
          //console.log("reset choices");
          setTimeout(() => {
            resetTurn();
          }, 1000);
        }

        if (Object.keys(message.playerStates).length === 2) {
          setStartGame(true);
        }
      } else if (message.type === "DISCONNECTED") {
        if (Object.keys(message.playerStates).length < 2) {
          setStartGame(false);
        }
        setPlayerStates(message.playerStates);
        alert(message.message);
      }
    },
    onClose(e) {
      console.log(`WebSocket closed with code: ${e.code}`);
      if (e.reason) {
        try {
          const reason = JSON.parse(e.reason);
          console.log(`Reason: ${reason.message}`);
          if (reason.type === "FULL") {
            alert("The room is full. Please try joining another room.");
          }
        } catch (e) {
          console.log(`Failed to parse close reason: ${e.reason}`);
        }
      } else {
        console.log("No reason provided");
      }
      menu();
    },
    onError(e) {
      console.log("error", e);
    },
  });

  const handleChoice = (card) => {
    if (!choiceOne) {
      setChoiceOne(card.id);
    } else {
      setChoiceTwo(card.id);
      setDisabled(true);
    }
    socket.send(
      JSON.stringify({ type: "FLIP_CARD", data: { cardId: card.id } })
    );
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const menu = () => {
    socket.close();
    if (Object.keys(playerStates).length < 1) {
      setAmountOfCards(null);
    }
    navigate("/");
  };

  useEffect(() => {
    if (cards.every((card) => card.matched) && cards.length > 0) {
      const playerEntries = Object.entries(playerStates);

      if (playerEntries.length >= 2) {
        // Directly compare the scores of the two players
        const [player1Id, player1Data] = playerEntries[0];
        const [player2Id, player2Data] = playerEntries[1];
        winner.current =
          player1Data.score > player2Data.score ? player1Id : player2Id;
        socket.send(
          JSON.stringify({
            type: "RESET_GAME",
            data: { amount: amountOfCards },
          })
        );
        setGameOver(true);
      } else {
        console.error("Not enough players to determine a winner.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  return (
    <div className="game balloon-container press-start-2p-regular">
      <>
        <h1>Memory Game</h1>
        <div className="options">
          <button onClick={menu}>⬅️ Menu</button>
        </div>
        {!gameOver ? (
          <>
            {!startGame && (
              <p>Game Status: waiting until another player joins...</p>
            )}
            <p>Green indicates your turn</p>
            <p>Turns Taken: {turns}</p>
            <ul className="user-status">
              {Object.entries(playerStates).map(([k, v], i) => (
                <div
                  key={i}
                  className={`${
                    currentTurn === k || v.isTurn ? "current-player" : ""
                  }`}
                >
                  <li>
                    {k} {currentPlayerId === k && "is you"}
                  </li>
                  <li>Score: {v.score}</li>
                </div>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p>Game Over</p>
            <p>Total turns: {turns}</p>
            <p>Winner is: {winner.current}</p>
            {winner.current === currentPlayerId ? (
              <p style={{ color: "green" }}>You won!!</p>
            ) : (
              <p style={{ color: "red" }}>{"You lost :("}</p>
            )}
          </>
        )}
      </>
      {startGame && (
        <Board
          cards={cards}
          handleChoice={handleChoice}
          turns={turns}
          choiceOne={choiceOne}
          choiceTwo={choiceTwo}
          disabled={disabled || !playerStates[currentPlayerId]?.isTurn}
        />
      )}
    </div>
  );
};

export default Game;
