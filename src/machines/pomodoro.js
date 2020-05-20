import { Machine, assign } from 'xstate';
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
      timer: {
        running: true,
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
          TICK: { actions: 'tick' },
        },
        invoke: { id: 'runTimer', src: 'createTimer' },
        entry: ['setRunning', 'setPomodoroContext'],
      },
      [SHORT]: {
        on: {
          [NEXT]: POMODORO,
          TICK: { actions: 'tick' },
        },
        invoke: { id: 'runTimer', src: 'createTimer' },
        entry: ['setRunning', 'setShortBreakContext'],
      },
      [LONG]: {
        on: {
          [NEXT]: POMODORO,
          TICK: { actions: 'tick' },
        },
        invoke: { id: 'runTimer', src: 'createTimer' },
        entry: ['setRunning', 'setLongBreakContext'],
        exit: 'resetBreak',
      },
    },
  },
  {
    actions: {
      setPomodoroContext: assign(({ breakCount }) => {
        if (breakCount >= 2) {
          return {
            duration: 25,
            buttons: {
              primary: LONG,
              secondary: [SHORT, SKIP_BREAK],
            },
          };
        }
        return {
          duration: 25,
          buttons: {
            primary: SHORT,
            secondary: [LONG, SKIP_BREAK],
          },
        };
      }),
      setShortBreakContext: assign(() => ({
        duration: 5,
        buttons: {
          primary: POMODORO,
        },
      })),
      setLongBreakContext: assign(() => ({
        duration: 15,
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
      tick: assign({
        timer: (_, event) => event.timer,
      }),
    },
    guards: {
      isLongBreak: ({ breakCount }) => breakCount >= 2,
    },
    services: {
      createTimer: (context) => createTimerMachine(context.duration),
    },
  },
);
