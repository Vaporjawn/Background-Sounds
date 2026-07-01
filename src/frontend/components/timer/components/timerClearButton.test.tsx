import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimerClearButton from './timerClearButton';

describe('TimerClearButton', () => {
  it('renders a Clear button when the timer is off', () => {
    render(<TimerClearButton timerOn={false} setTime={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('does not render when the timer is on', () => {
    render(<TimerClearButton timerOn setTime={jest.fn()} />);

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('resets time to 0 when clicked', async () => {
    const user = userEvent.setup();
    const setTime = jest.fn();

    render(<TimerClearButton timerOn={false} setTime={setTime} />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(setTime).toHaveBeenCalledWith(0);
  });
});
