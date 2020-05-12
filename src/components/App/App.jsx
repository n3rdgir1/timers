import React, { useState } from 'react';
import './App.scss';
import Pomodoro from '../Pomodoro/Pomodoro';
import LeanCoffee from '../LeanCoffee/LeanCoffee';

function App() {
  const [timer, setTimer] = useState('');

  return (
    <>
      <header className="App-header">
        <h1>{timer || 'Timers'}</h1>
        <div className="buttons">
          <button type="button" onClick={() => setTimer('Pomodoro')}>Pomodoro</button>
          <button type="button" onClick={() => setTimer('Lean Coffee')}>Lean Coffee</button>
        </div>
      </header>
      <main>
        {timer === 'Pomodoro' && <Pomodoro />}
        {timer === 'Lean Coffee' && <LeanCoffee />}
      </main>
    </>
  );
}

export default App;
