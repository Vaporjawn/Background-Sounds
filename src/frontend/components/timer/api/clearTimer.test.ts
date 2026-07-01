import clearTimer from './clearTimer';

describe('clearTimer', () => {
  it('resets time to 0', () => {
    const setTime = jest.fn();

    clearTimer({ setTime });

    expect(setTime).toHaveBeenCalledTimes(1);
    expect(setTime).toHaveBeenCalledWith(0);
  });
});
