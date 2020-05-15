import { Machine, assign, spawn } from 'xstate';
import { createTimerMachine } from './timer';

export const NEXT = 'Next Step';
export const WRAPUP = 'Wrapup';
export const CONTINUE = 'Continue';
export const DISCUSS = 'Discuss';

export const leanCoffeeMachine = Machine(
  {
    id: 'leanCoffeeMachine',
    initial: DISCUSS,
    states: {
      [DISCUSS]: {
        on: {
          [NEXT]: CONTINUE,
          [DISCUSS]: DISCUSS,
          [WRAPUP]: WRAPUP,
        },
        entry: ['setDiscussButtons', 'startDiscussionTimer'],
      },
      [CONTINUE]: {
        on: {
          [NEXT]: WRAPUP,
          [CONTINUE]: CONTINUE,
        },
        entry: ['setContinueButtons', 'startContinueTimer'],
      },
      [WRAPUP]: {
        on: {
          [NEXT]: DISCUSS,
          [WRAPUP]: WRAPUP,
        },
        entry: ['setWrapupButtons', 'startWrapupTimer'],
      },
    },
  },
  {
    actions: {
      setDiscussButtons: assign(() => ({
        buttons: {
          primary: CONTINUE,
          secondary: [WRAPUP, DISCUSS],
        },
      })),
      setContinueButtons: assign(() => ({
        buttons: {
          primary: WRAPUP,
          secondary: [CONTINUE],
        },
      })),
      setWrapupButtons: assign(() => ({
        buttons: {
          primary: DISCUSS,
          secondary: [WRAPUP],
        },
      })),
      startDiscussionTimer: assign(() => ({
        timer: spawn(createTimerMachine(5 * 60)),
      })),
      startContinueTimer: assign(() => ({
        timer: spawn(createTimerMachine(2 * 60)),
      })),
      startWrapupTimer: assign(() => ({
        timer: spawn(createTimerMachine(1 * 60)),
      })),
    },
  },
);
