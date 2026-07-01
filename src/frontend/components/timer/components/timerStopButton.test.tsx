import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimerStopButton from './timerStopButton';

describe('TimerStopButton', () => {
  it('renders a Stop button when the timer is on', () => {
    render(<TimerStopButton timerOn setTimerOn={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
  });

  it('does not render when the timer is off', () => {
    render(<TimerStopButton timerOn={false} setTimerOn={jest.fn()} />);

    expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument();
  });

  it('turns the timer off when clicked', async () => {
    const user = userEvent.setup();
    const setTimerOn = jest.fn();

    render(<TimerStopButton timerOn setTimerOn={setTimerOn} />);
    await user.click(screen.getByRole('button', { name: 'Stop' }));

    expect(setTimerOn).toHaveBeenCalledWith(false);
  });
});
