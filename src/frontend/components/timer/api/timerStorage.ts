export const TIMER_STORAGE_KEY = 'backgroundSoundsTimerState';

export interface PersistedTimerState {
  /** Elapsed seconds as of `updatedAt`. */
  time: number;
  timerOn: boolean;
  /** `Date.now()` at the moment this snapshot was captured. */
  updatedAt: number;
}

/**
 * `chrome.storage` is only available when this code runs inside the
 * extension (popup, background, etc.). During local development
 * (`npm run dev`) the page is loaded as a plain webpage, so `chrome` is
 * undefined - guard every access so the dev server doesn't crash.
 */
const getStorageArea = (): chrome.storage.LocalStorageArea | undefined => {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    return undefined;
  }

  return chrome.storage.local;
};

export const saveTimerState = (state: PersistedTimerState): void => {
  const storage = getStorageArea();

  if (!storage) {
    return;
  }

  storage.set({ [TIMER_STORAGE_KEY]: state });
};

export const loadTimerState = (callback: (state: PersistedTimerState | undefined) => void): void => {
  const storage = getStorageArea();

  if (!storage) {
    callback(undefined);
    return;
  }

  storage.get(TIMER_STORAGE_KEY, result => {
    callback(result[TIMER_STORAGE_KEY] as PersistedTimerState | undefined);
  });
};
