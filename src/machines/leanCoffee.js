import { Machine, assign } from 'xstate';
import { createTimerMachine } from './timer';

export const NEXT = 'Next Step';
export const WRAPUP = 'Wrapup';
export const CONTINUE = 'Continue';
export const DISCUSS = 'Discuss';

export const leanCoffeeMachine = Machine(
  {
    id: 'leanCoffeeMachine',
    initial: DISCUSS,
    context: {
      timer: {
        running: true,
      },
    },
    states: {
      [DISCUSS]: {
        on: {
          [NEXT]: CONTINUE,
          [DISCUSS]: DISCUSS,
          [WRAPUP]: WRAPUP,
          TICK: { actions: 'tick' },
        },
        invoke: { id: 'runTimer', src: 'createTimer' },
        entry: ['setDiscussContext'],
      },
      [CONTINUE]: {
        on: {
          [NEXT]: WRAPUP,
          [CONTINUE]: CONTINUE,
          TICK: { actions: 'tick' },
        },
        invoke: { id: 'runTimer', src: 'createTimer' },
        entry: ['setContinueContext'],
      },
      [WRAPUP]: {
        on: {
          [NEXT]: DISCUSS,
          [WRAPUP]: WRAPUP,
          TICK: { actions: 'tick' },
        },
        invoke: { id: 'runTimer', src: 'createTimer' },
        entry: ['setWrapupButtons'],
      },
    },
  },
  {
    actions: {
      setDiscussContext: assign(() => ({
        duration: 5,
        buttons: {
          primary: CONTINUE,
          secondary: [WRAPUP, DISCUSS],
        },
      })),
      setContinueContext: assign(() => ({
        duration: 2,
        buttons: {
          primary: WRAPUP,
          secondary: [CONTINUE],
        },
      })),
      setWrapupButtons: assign(() => ({
        duration: 1,
        buttons: {
          primary: DISCUSS,
          secondary: [WRAPUP],
        },
      })),
      tick: assign({
        timer: (_, event) => event.timer,
      }),
    },
    services: {
      createTimer: (context) => createTimerMachine(context.duration),
    },
  },
);
