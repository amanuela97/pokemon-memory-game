import React from "react";
import "./menu.css";
import { useGameContext } from "../../utils/state";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const options = [8, 12, 16];
  const { setAmountOfCards } = useGameContext();

  const chooseAmountOfCards = (val) => {
    setAmountOfCards(val);
    navigate("/game");
  };

  return (
    <div className="menu">
      <h1 className="menu__title press-start-2p-regular">
        Choose amount of cards
      </h1>
      <ul className="menu__options">
        {options.map((val, i) => (
          <li key={i} onClick={() => chooseAmountOfCards(val)}>
            {val} cards
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
