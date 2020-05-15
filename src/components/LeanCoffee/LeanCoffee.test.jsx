import React from 'react';
import { render, act, wait } from '@testing-library/react';
import LeanCoffee from './LeanCoffee';
import { DISCUSS, CONTINUE, WRAPUP } from '../../machines/leanCoffee';

jest.useFakeTimers();
jest.mock('../Alarm/Alarm');
jest.mock('../../machines/timer');
jest.mock('./Coffee/Coffee',
  () => ({ value, time }) => <mock-coffee data-testid="coffee" value={value} time={time} />);

describe('Lean Coffee', () => {
  const component = () => <LeanCoffee />;

  describe('when the timer is running', () => {
    it('shows no buttons', () => {
      const { queryAllByRole } = render(component());

      expect(queryAllByRole('button').length).toEqual(0);
    });

    it('wires up the to coffee timer', () => {
      const { getByTestId } = render(component());

      expect(getByTestId('coffee')).toHaveAttribute('value', DISCUSS);
      expect(getByTestId('coffee')).toHaveAttribute('time', 'parsed time');
    });
  });

  describe('when the timer is complete', () => {
    let getByTestId;
    let getAllByTestId;
    let getAllByRole;

    beforeEach(() => {
      ({ getByTestId, getAllByTestId, getAllByRole } = render(component()));
      act(() => jest.advanceTimersByTime(1));
    });

    it('shows the alarm', () => {
      expect(getByTestId('alarm')).toBeInTheDocument();
    });

    it('wires up the to coffee timer', () => {
      expect(getByTestId('coffee')).toHaveAttribute('value', DISCUSS);
      expect(getByTestId('coffee')).toHaveAttribute('time', 'done');
    });

    it('shows all 3 buttons', () => {
      expect(getAllByRole('button').length).toEqual(3);
    });

    it('shows primary button with correct text', () => {
      expect(getByTestId('primary')).toHaveTextContent('Continue');
    });

    it('shows secondary buttons with correct text', () => {
      const secondaryButtons = getAllByTestId('secondary');
      expect(secondaryButtons[0]).toHaveTextContent(WRAPUP);
      expect(secondaryButtons[1]).toHaveTextContent(DISCUSS);
    });

    it('switches to continue when the primary button is clicked', async () => {
      getByTestId('primary').click();

      await wait(() => expect(getByTestId(CONTINUE)).toBeInTheDocument());
    });

    it('switches to wrapup when the wrapup button is clicked', async () => {
      getAllByTestId('secondary')[0].click();

      await wait(() => expect(getByTestId(WRAPUP)).toBeInTheDocument());
    });
  });
});
