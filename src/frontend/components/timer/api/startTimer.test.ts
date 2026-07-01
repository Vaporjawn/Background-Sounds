import startTimer from './startTimer';

describe('startTimer', () => {
  it('sets timerOn to true', () => {
    const setTimerOn = jest.fn();

    startTimer({ setTimerOn });

    expect(setTimerOn).toHaveBeenCalledTimes(1);
    expect(setTimerOn).toHaveBeenCalledWith(true);
  });
});
