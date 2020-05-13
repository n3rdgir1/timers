import { Machine, assign } from 'xstate';

export const NEXT = 'Next Step';
export const SHORT = 'Short Break';
export const LONG = 'Long Break';
export const POMODORO = 'Pomodoro';
export const SKIP_BREAK = 'Skip Break';

export const pomodoroMachine = Machine(
  {
    id: 'pomodoroMachine',
    initial: 'pomodoro',
    context: {
      breakCount: 0,
      buttons: {
        primary: SHORT,
        secondary: [LONG, SKIP_BREAK],
      },
    },
    states: {
      pomodoro: {
        on: {
          [NEXT]: [
            {
              target: 'long',
              cond: 'isLongBreak',
            },
            {
              target: 'short',
              actions: 'incrementBreak',
            },
          ],
          [SKIP_BREAK]: {
            target: 'pomodoro',
            actions: 'incrementBreak',
          },
          [LONG]: {
            target: 'long',
            actions: 'incrementBreak',
          },
        },
        entry: 'setPomodoroButtons',
        exit: 'setBreakButtons',
      },
      short: {
        on: {
          [NEXT]: 'pomodoro',
        },
      },
      long: {
        on: {
          [NEXT]: 'pomodoro',
        },
      },
    },
  },
  {
    actions: {
      setPomodoroButtons: assign(({ breakCount }) => {
        if (breakCount >= 2) {
          return {
            buttons: {
              primary: LONG,
              secondary: [SHORT, SKIP_BREAK],
            },
          };
        }
        return {
          primary: SHORT,
          secondary: [LONG, SKIP_BREAK],
        };
      }),
      setBreakButtons: assign(() => ({
        buttons: {
          primary: POMODORO,
        },
      })),
      incrementBreak: assign((context) => ({
        breakCount: context.breakCount + 1,
      })),
    },
    guards: {
      isLongBreak: ({ breakCount }) => breakCount >= 2,
    },
  },
);
