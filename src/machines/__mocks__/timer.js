import { Machine, assign, sendParent } from 'xstate';

// eslint-disable-next-line import/prefer-default-export
export const createTimerMachine = () => Machine({
  initial: 'running',
  context: {
    remaining: 1,
  },
  states: {
    running: {
      onEntry: 'updateParentTimers',
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
          cond: ({ remaining }) => remaining === 0,
        },
        TICK: {
          actions: [
            assign({
              remaining: 0,
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
        display: remaining > 0 ? 'parsed time' : 'done',
      },
    })),
  },
});
