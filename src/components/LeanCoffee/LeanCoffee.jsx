import React, { useEffect } from 'react';
import { useMachine, useService } from '@xstate/react';
import Sound from 'react-sound';
import { leanCoffeeMachine, NEXT } from '../../machines/leanCoffee';
import Coffee from './Coffee/Coffee';
import './LeanCoffee.scss';

export default () => {
  const [state, send] = useMachine(leanCoffeeMachine);
  const { context, value } = state;
  const { buttons, timer } = context;
  const [time] = useService(timer);
  const { display, remaining } = time.context;

  useEffect(() => {
    document.title = display;
  }, [display]);

  return (
    <div data-testid={value} className={`leanCoffee ${value.toLowerCase()}`}>
      <h2>{value}</h2>
      <Coffee value={value} time={display} />
      {!remaining && (
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
        <div className="secondary">
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
        <Sound
          url="alarm.wav"
          playStatus={Sound.status.PLAYING}
          playFromPosition={0}
        />
      </>
      )}
    </div>
  );
};
