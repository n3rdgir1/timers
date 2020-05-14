import React from 'react';
import { render, wait } from '@testing-library/react';
import Pomodoro from './Pomodoro';
import { POMODORO, SHORT, LONG } from '../../machines/pomodoro';

describe('Pomodoro', () => {
  const component = () => <Pomodoro />;

  describe('when in pomodoro', () => {
    let getByTestId;
    let getAllByTestId;

    beforeEach(() => {
      ({ getByTestId, getAllByTestId } = render(component()));
    });

    it('renders the pomodoro', () => {
      expect(getByTestId(POMODORO)).toBeInTheDocument();
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

  describe('when in short break', () => {

  });

  describe('when in long break', () => {

  });
});
