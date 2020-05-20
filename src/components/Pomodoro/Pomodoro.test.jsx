import React from 'react';
import { render, wait, act } from '@testing-library/react';
import Pomodoro from './Pomodoro';
import { POMODORO, SHORT, LONG } from '../../machines/pomodoro';

jest.useFakeTimers();
jest.mock('../Alarm/Alarm');
jest.mock('../../machines/timer');
jest.mock('./Tomato/Tomato',
  () => ({ value, time }) => <mock-tomato data-testid="tomato" value={value} time={time} />);

describe('Pomodoro', () => {
  const component = () => <Pomodoro />;

  describe('when timer is running', () => {
    it('shows no buttons', () => {
      const { queryAllByRole } = render(component());

      expect(queryAllByRole('button').length).toEqual(0);
    });

    it('wires up the to tomato timer', () => {
      const { getByTestId } = render(component());

      expect(getByTestId('tomato')).toHaveAttribute('value', POMODORO);
      expect(getByTestId('tomato')).toHaveAttribute('time', 'parsed time');
    });
  });

  describe('when timer is complete', () => {
    let getByTestId;
    let getAllByTestId;
    let getAllByRole;

    beforeEach(() => {
      ({ getByTestId, getAllByTestId, getAllByRole } = render(component()));

      act(() => jest.advanceTimersByTime(1));
    });

    it('renders the pomodoro', () => {
      expect(getByTestId(POMODORO)).toBeInTheDocument();
    });

    it('wires up the to tomato timer', () => {
      expect(getByTestId('tomato')).toHaveAttribute('value', POMODORO);
      expect(getByTestId('tomato')).toHaveAttribute('time', 'done');
    });

    it('shows all 3 buttons', () => {
      expect(getAllByRole('button').length).toEqual(3);
    });

    it('shows the alarm', () => {
      expect(getByTestId('alarm')).toBeInTheDocument();
    });

    it('shows primary button with correct text', () => {
      expect(getByTestId('primary')).toHaveTextContent('Start Short Break');
    });

    it('shows secondary buttons with correct text', () => {
      const secondaryButtons = getAllByTestId('secondary');
      expect(secondaryButtons[0]).toHaveTextContent('Long Break');
      expect(secondaryButtons[1]).toHaveTextContent('Skip Break');
    });

    it('switches to short break when the primary button is clicked', async () => {
      getByTestId('primary').click();

      await wait(() => expect(getByTestId(SHORT)).toBeInTheDocument());
    });

    it('switches to long break when the long break button is clicked', async () => {
      getAllByTestId('secondary')[0].click();

      await wait(() => expect(getByTestId(LONG)).toBeInTheDocument());
    });

    it('skips breaks when skip break button is clicked', async () => {
      getAllByTestId('secondary')[1].click();

      await wait(() => expect(getByTestId(POMODORO)).toBeInTheDocument());
    });
  });
});
