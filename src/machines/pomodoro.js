import { Machine, assign } from 'xstate';

export const NEXT = 'Next Step';
export const SHORT = 'Short Break';
export const LONG = 'Long Break';
export const POMODORO = 'Pomodoro';
export const SKIP_BREAK = 'Skip Break';

export const pomodoroMachine = Machine(
  {
    id: 'pomodoroMachine',
    initial: POMODORO,
    context: {
      breakCount: 0,
      buttons: {
        primary: SHORT,
        secondary: [LONG, SKIP_BREAK],
      },
    },
    states: {
      [POMODORO]: {
        on: {
          [NEXT]: [
            {
              target: LONG,
              cond: 'isLongBreak',
            },
            {
              target: SHORT,
              actions: 'incrementBreak',
            },
          ],
          [SKIP_BREAK]: {
            target: POMODORO,
            actions: 'incrementBreak',
          },
          [LONG]: {
            target: LONG,
            actions: 'incrementBreak',
          },
        },
        entry: 'setPomodoroButtons',
        exit: 'setBreakButtons',
      },
      [SHORT]: {
        on: {
          [NEXT]: POMODORO,
        },
      },
      [LONG]: {
        on: {
          [NEXT]: POMODORO,
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
