import React from 'react';
import './menu.css';

const Menu = ({ setAmmount }) => {
  const options = [12, 16, 20];
  return (
    <div className="menu">
      <h1 className="menu__title">Choose amount of cards</h1>
      <ul className="menu__options">
        {options.map((val, i) => (
          <li key={i} onClick={() => setAmmount(val)}>
            {val} cards
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
