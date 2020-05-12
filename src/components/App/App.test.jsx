import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('../Pomodoro/Pomodoro');
jest.mock('../LeanCoffee/LeanCoffee');

describe('App', () => {
  it('displays the timer list when there are no timers', () => {
    const { getAllByRole } = render(<App />);
    const buttons = getAllByRole('button');

    expect(buttons.length).toEqual(2);
    expect(buttons[0]).toHaveTextContent('Pomodoro');
    expect(buttons[1]).toHaveTextContent('Lean Coffee');
  });

  it('renders learn react link', () => {
    const { getByText } = render(<App />);

    expect(getByText('Timers')).toBeInTheDocument();
  });

  it('renders pomodoro when the pomodoro button is clicked', () => {
    const { getByRole, getAllByRole, getByTestId } = render(<App />);
    getAllByRole('button')[0].click();

    expect(getByRole('heading')).toHaveTextContent('Pomodoro');
    expect(getByTestId('pomodoro')).toBeInTheDocument();
  });

  it('renders lean coffee when the lean coffee button is clicked', () => {
    const { getByRole, getAllByRole, getByTestId } = render(<App />);
    getAllByRole('button')[1].click();

    expect(getByRole('heading')).toHaveTextContent('Lean Coffee');
    expect(getByTestId('lean-coffee')).toBeInTheDocument();
  });
});
