import { loadTimerState, saveTimerState, TIMER_STORAGE_KEY, type PersistedTimerState } from './timerStorage';

describe('timerStorage', () => {
  const originalChrome = global.chrome;

  afterEach(() => {
    global.chrome = originalChrome;
    jest.restoreAllMocks();
  });

  describe('when chrome.storage is unavailable (e.g. `npm run dev` outside the extension)', () => {
    beforeEach(() => {
      global.chrome = undefined as unknown as typeof chrome;
    });

    it('loadTimerState calls back with undefined instead of throwing', () => {
      const callback = jest.fn();

      expect(() => loadTimerState(callback)).not.toThrow();
      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it('saveTimerState does not throw', () => {
      expect(() => saveTimerState({ time: 1, timerOn: false, updatedAt: Date.now() })).not.toThrow();
    });
  });

  describe('when chrome.storage.local is available', () => {
    const set = jest.fn();
    const get = jest.fn();

    beforeEach(() => {
      set.mockReset();
      get.mockReset();
      global.chrome = {
        storage: {
          local: { set, get },
        },
      } as unknown as typeof chrome;
    });

    it('saveTimerState writes the state under TIMER_STORAGE_KEY', () => {
      const state: PersistedTimerState = { time: 12.34, timerOn: true, updatedAt: 999 };

      saveTimerState(state);

      expect(set).toHaveBeenCalledWith({ [TIMER_STORAGE_KEY]: state });
    });

    it('loadTimerState resolves with the state stored under TIMER_STORAGE_KEY', () => {
      const state: PersistedTimerState = { time: 5, timerOn: false, updatedAt: 111 };
      get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) =>
        callback({ [TIMER_STORAGE_KEY]: state })
      );

      const callback = jest.fn();
      loadTimerState(callback);

      expect(get).toHaveBeenCalledWith(TIMER_STORAGE_KEY, expect.any(Function));
      expect(callback).toHaveBeenCalledWith(state);
    });

    it('loadTimerState calls back with undefined when nothing is stored yet', () => {
      get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => callback({}));

      const callback = jest.fn();
      loadTimerState(callback);

      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });
});
