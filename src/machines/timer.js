import { Machine, assign, sendParent } from 'xstate';

const parseTime = (time) => {
  let seconds = time % 60;
  const minutes = (time - seconds) / 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

// eslint-disable-next-line import/prefer-default-export
export const createTimerMachine = (duration) => Machine({
  initial: 'running',
  context: {
    remaining: duration * 60,
  },
  states: {
    running: {
      onEntry: 'updateParentTimers',
      invoke: {
        src: () => (cb) => {
          const interval = setInterval(() => {
            cb('TICK');
          }, 1000);

          return () => {
            clearInterval(interval);
          };
        },
      },
      on: {
        '': {
          target: 'paused',
          cond: ({ remaining }) => remaining === 0,
        },
        TICK: {
          actions: [
            assign({
              remaining: ({ remaining }) => remaining - 1,
            }),
            'updateParentTimers',
          ],
        },
      },
    },
    paused: {
      type: 'final',
    },
  },
},
{
  actions: {
    updateParentTimers: sendParent(({ remaining }) => ({
      type: 'TICK',
      timer: {
        running: remaining !== 0,
        display: parseTime(remaining),
      },
    })),
  },
});
