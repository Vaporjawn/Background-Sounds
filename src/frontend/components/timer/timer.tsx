import { useState, useEffect, useRef } from 'react';
import TimerClearButton from './components/timerClearButton';
import TimerStartButton from './components/timerStartButton';
import TimerStopButton from './components/timerStopButton';
import { loadTimerState, saveTimerState } from './api/timerStorage';

const TICK_INTERVAL_MS = 10;

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  // Mirrors `time` so the effect below can read the latest value without
  // depending on `time` (which would otherwise restart the interval, and
  // therefore reset the elapsed-time baseline, on every tick).
  const timeRef = useRef(time);
  // Mirrors the latest render's state (updated unconditionally, not via an
  // effect) so the async storage callback below can check "did the user
  // already interact with the timer while the read was in flight?" without
  // depending on stale closure values.
  const latestStateRef = useRef({ time, timerOn });
  latestStateRef.current = { time, timerOn };

  // Rehydrate from chrome.storage on mount. Chrome unmounts (and discards
  // all React state from) the extension popup every time it closes, so
  // without this the timer silently resets to 0 each time the user reopens
  // it. If a run was in progress when the popup last closed, fold in the
  // wall-clock time that has passed since so the stopwatch reads as if it
  // had kept counting the whole time.
  useEffect(() => {
    loadTimerState(persisted => {
      // If the user already started the timer while this (async) read was
      // in flight, don't clobber their fresh interaction with stale data.
      if (persisted && !latestStateRef.current.timerOn) {
        const restoredTime = persisted.timerOn
          ? persisted.time + (Date.now() - persisted.updatedAt) / 1000
          : persisted.time;

        setTime(restoredTime);
        setTimerOn(persisted.timerOn);
      }

      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  // Persist whenever the timer is paused (covers Stop and Clear) with the
  // freshest `time` value. Intentionally skipped while running: writing on
  // every 10ms tick would be wasteful, and is unnecessary because rehydration
  // recomputes elapsed time from `updatedAt` below.
  useEffect(() => {
    if (!isHydrated || timerOn) {
      return;
    }

    saveTimerState({ time, timerOn, updatedAt: Date.now() });
  }, [isHydrated, time, timerOn]);

  useEffect(() => {
    if (!timerOn) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    // Derive elapsed time from wall-clock timestamp deltas rather than
    // counting ticks. setInterval is not guaranteed to fire at exactly
    // TICK_INTERVAL_MS, so accumulating a fixed increment per tick drifts
    // from real elapsed time; performance.now() deltas do not.
    const timeAtStart = timeRef.current;
    const startTimestamp = performance.now();

    if (isHydrated) {
      saveTimerState({ time: timeAtStart, timerOn: true, updatedAt: Date.now() });
    }

    intervalRef.current = setInterval(() => {
      const elapsedSeconds = (performance.now() - startTimestamp) / 1000;
      setTime(timeAtStart + elapsedSeconds);
    }, TICK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [timerOn, isHydrated]);

  return (
    <>
      <div>{time.toFixed(2)} seconds</div>
      <TimerStartButton timerOn={timerOn} setTimerOn={setTimerOn} />
      <TimerStopButton timerOn={timerOn} setTimerOn={setTimerOn} />
      <TimerClearButton timerOn={timerOn} setTime={setTime} />
    </>
  );
};

export default Timer;
