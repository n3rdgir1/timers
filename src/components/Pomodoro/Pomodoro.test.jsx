import React from 'react';
import { render, wait } from '@testing-library/react';
import Pomodoro from './Pomodoro';
import { POMODORO, SHORT, LONG } from '../../machines/pomodoro';

describe('Pomodoro', () => {
  const component = () => <Pomodoro />;

  describe('when in pomodoro', () => {
    let getByTestId;
    let getAllByTestId;
    let getAllByRole;

    beforeEach(() => {
      ({ getByTestId, getAllByTestId, getAllByRole } = render(component()));
    });

    it('renders the pomodoro', () => {
      expect(getByTestId(POMODORO)).toBeInTheDocument();
    });

    it('shows all 3 buttons', () => {
      expect(getAllByRole('button').length).toEqual(3);
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
    let getByTestId;
    let getAllByRole;

    beforeEach(() => {
      ({ getByTestId, getAllByRole } = render(component()));
      getByTestId('primary').click();
    });

    it('renders the short break', () => {
      expect(getByTestId(SHORT)).toBeInTheDocument();
    });

    it('shows the button', () => {
      expect(getAllByRole('button').length).toEqual(1);
    });

    it('shows primary button with correct text', () => {
      expect(getByTestId('primary')).toHaveTextContent('Start Pomodoro');
    });

    it('switches to pomodoro when the primary button is clicked', async () => {
      getByTestId('primary').click();

      await wait(() => expect(getByTestId(POMODORO)).toBeInTheDocument());
    });
  });

  describe('when in long break', () => {
    let getByTestId;
    let getAllByRole;

    beforeEach(() => {
      ({ getByTestId, getAllByRole } = render(component()));
      getByTestId('primary').click();
      getByTestId('primary').click();
      getByTestId('primary').click();
      getByTestId('primary').click();
      getByTestId('primary').click();
    });

    it('renders the long break', () => {
      expect(getByTestId(LONG)).toBeInTheDocument();
    });

    it('shows the button', () => {
      expect(getAllByRole('button').length).toEqual(1);
    });

    it('shows primary button with correct text', () => {
      expect(getByTestId('primary')).toHaveTextContent('Start Pomodoro');
    });

    it('switches to pomodoro when the primary button is clicked', async () => {
      getByTestId('primary').click();

      await wait(() => expect(getByTestId(POMODORO)).toBeInTheDocument());
    });
  });
});
