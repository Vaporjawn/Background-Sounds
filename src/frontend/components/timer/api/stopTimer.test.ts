import stopTimer from './stopTimer';

describe('stopTimer', () => {
  it('sets timerOn to false', () => {
    const setTimerOn = jest.fn();

    stopTimer({ setTimerOn });

    expect(setTimerOn).toHaveBeenCalledTimes(1);
    expect(setTimerOn).toHaveBeenCalledWith(false);
  });
});
