import { act, fireEvent, render, screen } from '@testing-library/react';
import Timer from './timer';
import { TIMER_STORAGE_KEY, type PersistedTimerState } from './api/timerStorage';

describe('Timer', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders at 0 seconds with the timer stopped', () => {
    render(<Timer />);

    expect(screen.getByText('0.00 seconds')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument();
  });

  it('counts up while running and stops changing once Stop is clicked', () => {
    jest.useFakeTimers();
    render(<Timer />);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('1.00 seconds')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Stopped: further real/fake time passing should not move the display.
    expect(screen.getByText('1.00 seconds')).toBeInTheDocument();
  });

  it('resumes counting from where it left off after Stop then Start', () => {
    jest.useFakeTimers();
    render(<Timer />);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('1.00 seconds')).toBeInTheDocument();
  });

  it('resets to 0 seconds when Clear is clicked while stopped', () => {
    jest.useFakeTimers();
    render(<Timer />);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByText('0.00 seconds')).toBeInTheDocument();
  });

  it('derives elapsed time from performance.now() deltas, not the number of ticks that fired (regression test for the drift bug)', () => {
    // Legacy fake timers control setInterval/setTimeout only, leaving us
    // free to mock performance.now() independently - letting this test
    // prove the *mechanism*, not just the outcome. Only a single 10ms tick
    // fires below, but performance.now() is made to report that ~1 real
    // second passed (e.g. a throttled/backgrounded popup). The previous
    // implementation added a fixed 0.01s per tick regardless of real
    // elapsed time, so it would have shown "0.01 seconds" here.
    jest.useFakeTimers({ legacyFakeTimers: true });
    let now = 1_000_000;
    jest.spyOn(performance, 'now').mockImplementation(() => now);

    render(<Timer />);
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    now += 1000;
    act(() => {
      jest.advanceTimersByTime(10);
    });

    expect(screen.getByText('1.00 seconds')).toBeInTheDocument();
  });
});

describe('Timer with persisted chrome.storage state', () => {
  const originalChrome = global.chrome;

  afterEach(() => {
    global.chrome = originalChrome;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const mockPersistedState = (state: PersistedTimerState | undefined) => {
    global.chrome = {
      storage: {
        local: {
          get: (_key: string, callback: (result: Record<string, unknown>) => void) =>
            callback(state ? { [TIMER_STORAGE_KEY]: state } : {}),
          set: jest.fn(),
        },
      },
    } as unknown as typeof chrome;
  };

  it('restores a paused elapsed time exactly as persisted', () => {
    mockPersistedState({ time: 42.5, timerOn: false, updatedAt: Date.now() });

    render(<Timer />);

    expect(screen.getByText('42.50 seconds')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('folds in wall-clock time that passed while the popup was closed for a run in progress', () => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    jest.spyOn(performance, 'now').mockReturnValue(500_000);
    jest.spyOn(Date, 'now').mockReturnValue(10_000);

    // Popup closed 3 seconds ago while a run was in progress at 10s elapsed.
    mockPersistedState({ time: 10, timerOn: true, updatedAt: 10_000 - 3000 });

    render(<Timer />);

    expect(screen.getByText('13.00 seconds')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
  });

  it('does not let a slow storage read clobber a Start click made while it was in flight', () => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    jest.spyOn(performance, 'now').mockReturnValue(0);

    let deferredCallback: ((result: Record<string, unknown>) => void) | undefined;
    global.chrome = {
      storage: {
        local: {
          get: (_key: string, callback: (result: Record<string, unknown>) => void) => {
            deferredCallback = callback;
          },
          set: jest.fn(),
        },
      },
    } as unknown as typeof chrome;

    render(<Timer />);

    // User starts the timer before the (still in-flight) storage read resolves.
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByText('0.00 seconds')).toBeInTheDocument();

    // The storage read now resolves with stale data claiming the timer was
    // paused at 99 seconds - this must not overwrite the user's fresh click.
    act(() => {
      deferredCallback?.({ [TIMER_STORAGE_KEY]: { time: 99, timerOn: false, updatedAt: 0 } });
    });

    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    expect(screen.queryByText('99.00 seconds')).not.toBeInTheDocument();
  });
});
