import { Machine, assign } from 'xstate';

// eslint-disable-next-line import/prefer-default-export
export const createTimerMachine = () => Machine({
  initial: 'running',
  context: {
    remaining: 1,
    duration: 1,
    display: 'parsed time',
  },
  states: {
    running: {
      invoke: {
        src: () => (cb) => {
          const interval = setInterval(() => {
            cb('TICK');
          }, 1);

          return () => {
            clearInterval(interval);
          };
        },
      },
      on: {
        '': {
          target: 'paused',
          cond: (context) => context.remaining === 0,
        },
        TICK: {
          actions: assign({
            remaining: () => 0,
            display: () => 'done',
          }),
        },
      },
    },
    paused: { },
  },
});
