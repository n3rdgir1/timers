import { Machine, assign, spawn } from 'xstate';
import { createTimerMachine } from './timer';

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
        entry: ['setPomodoroButtons', 'startPomodoroTimer'],
        exit: 'setBreakButtons',
      },
      [SHORT]: {
        on: {
          [NEXT]: POMODORO,
        },
        entry: 'startShortBreakTimer',
      },
      [LONG]: {
        on: {
          [NEXT]: POMODORO,
        },
        entry: 'startLongBreakTimer',
        exit: 'resetBreak',
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
          buttons: {
            primary: SHORT,
            secondary: [LONG, SKIP_BREAK],
          },
        };
      }),
      startPomodoroTimer: assign(() => ({
        timer: spawn(createTimerMachine(25 * 60)),
      })),
      setBreakButtons: assign(() => ({
        buttons: {
          primary: POMODORO,
        },
      })),
      incrementBreak: assign((context) => ({
        breakCount: context.breakCount + 1,
      })),
      resetBreak: assign(() => ({
        breakCount: 0,
      })),
      startLongBreakTimer: assign(() => ({
        timer: spawn(createTimerMachine(15 * 60)),
      })),
      startShortBreakTimer: assign(() => ({
        timer: spawn(createTimerMachine(5 * 60)),
      })),
    },
    guards: {
      isLongBreak: ({ breakCount }) => breakCount >= 2,
    },
  },
);
