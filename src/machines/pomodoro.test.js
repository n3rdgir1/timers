import { interpret } from 'xstate';

import {
  pomodoroMachine, SHORT, LONG, NEXT, SKIP_BREAK, POMODORO,
} from './pomodoro';

describe('Pomodoro Machine', () => {
  it('starts with pomodoro', (done) => {
    interpret(pomodoroMachine)
      .onTransition((state) => {
        expect(state.value).toEqual('pomodoro');

        done();
      })
      .start();
  });

  it('runs normal cycle', () => {
    const { initialState } = pomodoroMachine;
    expect(initialState.value).toEqual('pomodoro');
    const firstBreak = pomodoroMachine.transition(initialState, NEXT);
    expect(firstBreak.value).toEqual('short');
    const secondPomodoro = pomodoroMachine.transition(firstBreak, NEXT);
    expect(secondPomodoro.value).toEqual('pomodoro');
    const secondBreak = pomodoroMachine.transition(secondPomodoro, NEXT);
    expect(secondBreak.value).toEqual('short');
    const thirdPomodoro = pomodoroMachine.transition(secondBreak, NEXT);
    expect(thirdPomodoro.value).toEqual('pomodoro');
    const longBreak = pomodoroMachine.transition(thirdPomodoro, NEXT);
    expect(longBreak.value).toEqual('long');
    const backToBeginning = pomodoroMachine.transition(longBreak, NEXT);
    expect(backToBeginning.value).toEqual('pomodoro');
  });

  it('ensures break cycle even if short breaks are skipped', () => {
    const { initialState } = pomodoroMachine;
    const secondPomodoro = pomodoroMachine.transition(initialState, SKIP_BREAK);
    expect(secondPomodoro.value).toEqual('pomodoro');
    const secondBreak = pomodoroMachine.transition(secondPomodoro, NEXT);
    expect(secondBreak.value).toEqual('short');
    const thirdPomodoro = pomodoroMachine.transition(secondBreak, NEXT);
    expect(thirdPomodoro.value).toEqual('pomodoro');
    const longBreak = pomodoroMachine.transition(thirdPomodoro, NEXT);
    expect(longBreak.value).toEqual('long');
    const backToBeginning = pomodoroMachine.transition(longBreak, NEXT);
    expect(backToBeginning.value).toEqual('pomodoro');
  });

  it('ensures you take a long break if long breaks are skipped', () => {
    const { initialState } = pomodoroMachine;
    expect(initialState.value).toEqual('pomodoro');
    const firstBreak = pomodoroMachine.transition(initialState, NEXT);
    expect(firstBreak.value).toEqual('short');
    const secondPomodoro = pomodoroMachine.transition(firstBreak, NEXT);
    expect(secondPomodoro.value).toEqual('pomodoro');
    const secondBreak = pomodoroMachine.transition(secondPomodoro, NEXT);
    expect(secondBreak.value).toEqual('short');
    const thirdPomodoro = pomodoroMachine.transition(secondBreak, NEXT);
    expect(thirdPomodoro.value).toEqual('pomodoro');
    const fourthPomodoro = pomodoroMachine.transition(thirdPomodoro, SKIP_BREAK);
    expect(fourthPomodoro.value).toEqual('pomodoro');
    const longBreak = pomodoroMachine.transition(fourthPomodoro, NEXT);
    expect(longBreak.value).toEqual('long');
    const backToBeginning = pomodoroMachine.transition(longBreak, NEXT);
    expect(backToBeginning.value).toEqual('pomodoro');
  });

  describe('when next break is short', () => {
    let state;

    beforeEach(() => {
      state = pomodoroMachine.initialState;
    });

    it('has button options', () => {
      expect(state.context.buttons).toEqual({
        primary: SHORT,
        secondary: [LONG, SKIP_BREAK],
      });
    });

    it('supports LONG transition', () => {
      const nextStep = pomodoroMachine.transition(state, LONG);
      expect(nextStep.value).toEqual('long');
    });

    it('sets the button state for the break', () => {
      const nextStep = pomodoroMachine.transition(state, NEXT);
      expect(nextStep.context.buttons).toEqual({
        primary: POMODORO,
      });
    });
  });

  describe('when next break is long', () => {
    let state;

    beforeEach(() => {
      state = pomodoroMachine.iniitalState;
      state = pomodoroMachine.transition(state, NEXT);
      state = pomodoroMachine.transition(state, NEXT);
      state = pomodoroMachine.transition(state, NEXT);
      state = pomodoroMachine.transition(state, NEXT);
    });

    it('has button options', () => {
      expect(state.context.buttons).toEqual({
        primary: LONG,
        secondary: [SHORT, SKIP_BREAK],
      });
    });

    it('sets the button state for the break', () => {
      const nextStep = pomodoroMachine.transition(state, NEXT);
      expect(nextStep.context.buttons).toEqual({
        primary: POMODORO,
      });
    });
  });
});
