import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { leanCoffeeMachine, NEXT } from '../../machines/leanCoffee';
import Coffee from './Coffee/Coffee';
import './LeanCoffee.scss';
import Alarm from '../Alarm/Alarm';

export default () => {
  const [state, send] = useMachine(leanCoffeeMachine);
  const { context, value } = state;
  const { buttons, timer } = context;
  const { display, running } = timer;

  useEffect(() => {
    document.title = display;
  }, [display]);

  return (
    <div data-testid={value} className={`leanCoffee ${value.toLowerCase()}`}>
      <h2>{value}</h2>
      <Coffee value={value} time={display} />
      {!running && (
      <>
        <button
          type="button"
          data-testid="primary"
          className="primary"
          onClick={() => send(NEXT)}
        >
          {buttons.primary}
        </button>
        {buttons.secondary && (
        <div className={`secondary ${buttons.secondary.length === 1 ? 'full-width' : ''}`}>
          {buttons.secondary.map((button) => (
            <button
              type="button"
              data-testid="secondary"
              key={button}
              onClick={() => send(button)}
            >
              {button}
            </button>
          ))}
        </div>
        )}
        <Alarm />
      </>
      )}
    </div>
  );
};
