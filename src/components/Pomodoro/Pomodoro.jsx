import React from 'react';
import { useMachine } from '@xstate/react';
import { pomodoroMachine, NEXT } from '../../machines/pomodoro';


export default () => {
  const [state, send] = useMachine(pomodoroMachine);
  const { context, value } = state;
  const { buttons } = context;

  return (
    <div data-testid={value}>
      <h2>{value}</h2>
      {buttons.secondary && buttons.secondary.map((button) => (
        <button
          type="button"
          data-testid="secondary"
          key={button}
          onClick={() => send(button)}
        >
          {button}
        </button>
      ))}
      <button
        type="button"
        data-testid="primary"
        onClick={() => send(NEXT)}
      >
        Start
        {' '}
        {buttons.primary}
      </button>
    </div>
  );
};
