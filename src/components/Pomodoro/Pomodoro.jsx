import React, { useEffect } from 'react';
import { useMachine, useService } from '@xstate/react';
import Sound from 'react-sound';
import { pomodoroMachine, NEXT } from '../../machines/pomodoro';
import Tomato from './Tomato/Tomato';
import './Pomodoro.scss';

export default () => {
  const [state, send] = useMachine(pomodoroMachine);
  const { context, value } = state;
  const { buttons, timer } = context;
  const [time] = useService(timer);
  const { display, remaining } = time.context;

  useEffect(() => {
    document.title = display;
  }, [display]);

  return (
    <div data-testid={value} className={`pomodoro ${value.toLowerCase()}`}>
      <h2>{value}</h2>
      <Tomato value={value} time={display} />
      {!remaining && (
      <>
        <button
          type="button"
          data-testid="primary"
          className="primary"
          onClick={() => send(NEXT)}
        >
          Start
          {' '}
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
