import { useState } from 'react';
import Menu from './components/menu/Menu';
import Game from './components/game';

function App() {
  const [amount, setAmount] = useState(null);

  return (
    <div className="app">
      {!amount ? (
        <Menu setAmmount={setAmount} />
      ) : (
        <Game amount={amount} setAmmount={setAmount} />
      )}
    </div>
  );
}

export default App;
