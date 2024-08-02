import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import switchfx from "../../sounds/switch.mp3";
import victoryfx from "../../sounds/victory.mp3";
import lossfx from "../../sounds/loss.mp3";
import "./index.css";
import Board from "./board";
import usePartySocket from "partysocket/react";
import { useGameContext } from "../../utils/state";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const [switchTurn] = useSound(switchfx, { volume: 0.6 });
  const [playVictory] = useSound(victoryfx, { volume: 0.6 });
  const [playLoss] = useSound(lossfx, { volume: 0.6 });
  const navigate = useNavigate();
  const { amountOfCards, setAmountOfCards } = useGameContext();
  const [cards, setCards] = useState([]);
  const [playerStates, setPlayerStates] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [winner, setWinner] = useState(null);

  const socket = usePartySocket({
    host: process.env.REACT_APP_HOST,
    room: `memory-game-${amountOfCards}`,
    onOpen(e) {
      console.log("connected");
    },
    onMessage(e) {
      const message = JSON.parse(e.data);
      //console.log("message", message);

      if (message.type === "GAME_STATE") {
        setCards(message.gameBoard);
        setCurrentTurn(message.currentTurn);
        setPlayerStates(message.playerStates);

        if (!gameOver && isFlippedAndNotMatched() === 2 && isTurn()) {
          //console.log("switch");
          isTurn();
          switchTurn();
        }

        if (!currentPlayerId) {
          setCurrentPlayerId(message.playerId);
        }

        if (!startGame && totalPlayers(message) === 2) {
          //console.log("start game");
          setStartGame(true);
          setGameOver(false);
        }
      } else if (message.type === "GAME_OVER") {
        // Handle game over logic, e.g., display winner and reset game
        // console.log("game over");
        const { winner } = message;
        if (winner === currentPlayerId) {
          playVictory();
        } else if (winner) {
          playLoss();
        }
        setWinner(winner);
        setGameOver(true);
        resetBoard();
      } else if (message.type === "DISCONNECTED") {
        if (totalPlayers(message) < 2) {
          setStartGame(false);
          setGameOver(true);
          resetBoard();
        }
        //setPlayerStates(message.playerStates);
        console.log(message.message);
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

  // Preload utility
  const preloadImages = (urls) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  useEffect(() => {
    const imageUrls = cards.map((card) => card.value);
    preloadImages(imageUrls);
  }, [cards]);

  const resetBoard = () =>
    socket.send(
      JSON.stringify({
        type: "RESET_GAME",
        data: { amount: amountOfCards },
      })
    );

  const handleChoice = (card) => {
    socket.send(
      JSON.stringify({ type: "FLIP_CARD", data: { cardId: card.id } })
    );
  };

  const menu = () => {
    socket.close();
    if (Object.keys(playerStates).length < 1) {
      setAmountOfCards(null);
    }
    navigate("/");
  };

  const isFlippedAndNotMatched = () =>
    cards.filter((card) => card.isFlipped && !card.matched).length;

  const isTurn = () => currentTurn === currentPlayerId;

  const totalPlayers = (message) => Object.keys(message.playerStates).length;

  return (
    <div className="game balloon-container press-start-2p-regular">
      <>
        <h1>Memory Game</h1>
        <div className="options">
          <button onClick={menu}>⬅️ Menu</button>
        </div>
        {gameOver ? (
          <>
            <p>Game Over</p>
            {winner ? <p>Winner is: {winner}</p> : <p>Game is Tied</p>}
            {winner === currentPlayerId ? (
              <>
                {winner && (
                  <p style={{ color: "green", margin: 0 }}>You won!!</p>
                )}
                <p style={{ color: "blue" }}>
                  Score: {playerStates[currentPlayerId]?.score}
                </p>
              </>
            ) : (
              <>
                {winner && (
                  <p style={{ color: "red", margin: 0 }}>{"You lost :("}</p>
                )}
                <p style={{ color: "blue" }}>
                  Score: {playerStates[currentPlayerId]?.score}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            {!startGame && (
              <p>Game Status: waiting until another player joins...</p>
            )}
            <p>Green indicates your turn</p>
            <ul className="user-status">
              {Object.entries(playerStates).map(([k, v], i) => (
                <div key={i} className={`${v.isTurn ? "current-player" : ""}`}>
                  <li>
                    {k} {currentPlayerId === k && "is you"}
                  </li>
                  <li>Score: {v.score}</li>
                </div>
              ))}
            </ul>
          </>
        )}
      </>
      {startGame && (
        <Board
          cards={cards}
          handleChoice={handleChoice}
          disabled={currentTurn !== currentPlayerId}
        />
      )}
    </div>
  );
};

export default Game;
