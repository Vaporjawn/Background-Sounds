import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimerStartButton from './timerStartButton';

describe('TimerStartButton', () => {
  it('renders a Start button when the timer is off', () => {
    render(<TimerStartButton timerOn={false} setTimerOn={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('does not render when the timer is on', () => {
    render(<TimerStartButton timerOn setTimerOn={jest.fn()} />);

    expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
  });

  it('turns the timer on when clicked', async () => {
    const user = userEvent.setup();
    const setTimerOn = jest.fn();

    render(<TimerStartButton timerOn={false} setTimerOn={setTimerOn} />);
    await user.click(screen.getByRole('button', { name: 'Start' }));

    expect(setTimerOn).toHaveBeenCalledWith(true);
  });
});
