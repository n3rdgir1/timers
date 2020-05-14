import { Machine, assign } from 'xstate';

const parseTime = (time) => {
  let seconds = time % 60;
  const minutes = (time - seconds) / 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

const calculateReamining = (context) => +(context.remaining - context.interval).toFixed(2);

// eslint-disable-next-line import/prefer-default-export
export const createTimerMachine = (duration) => Machine({
  initial: 'running',
  context: {
    remaining: duration,
    duration,
    display: parseTime(duration),
    interval: 1,
  },
  states: {
    running: {
      invoke: {
        src: (context) => (cb) => {
          const interval = setInterval(() => {
            cb('TICK');
          }, 1000 * context.interval);

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
            remaining: (context) => calculateReamining(context),
            display: (context) => parseTime(calculateReamining(context)),
          }),
        },
      },
    },
    paused: {
      on: {
        '': {
          target: 'running',
          cond: (context) => context.remaining > 0,
        },
      },
    },
  },
  on: {
    'DURATION.UPDATE': {
      actions: assign({
        duration: (_, event) => event.value,
      }),
    },
    RESET: {
      actions: assign({
        remaining: duration,
      }),
    },
  },
});
