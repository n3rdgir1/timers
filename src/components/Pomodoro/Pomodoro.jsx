import React from 'react';
import { useMachine } from '@xstate/react';
import { pomodoroMachine, NEXT } from '../../machines/pomodoro';
import Tomato from './Tomato/Tomato';
import './Pomodoro.scss';

export default () => {
  const [state, send] = useMachine(pomodoroMachine);
  const { context, value } = state;
  const { buttons } = context;

  return (
    <div data-testid={value} className={`pomodoro ${value.toLowerCase()}`}>
      <h2>{value}</h2>
      <Tomato value={value} />
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
    </div>
  );
};
