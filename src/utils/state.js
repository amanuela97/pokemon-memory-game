import { createContext, useContext, useState } from "react";

export const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
  const [amountOfCards, setAmountOfCards] = useState(null);

  return (
    <GameContext.Provider value={{ amountOfCards, setAmountOfCards }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
