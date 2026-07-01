import { useState, useEffect, useRef } from 'react';
import TimerClearButton from './components/timerClearButton';
import TimerStartButton from './components/timerStartButton';
import TimerStopButton from './components/timerStopButton';

const TICK_INTERVAL_MS = 10;

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  // Mirrors `time` so the effect below can read the latest value without
  // depending on `time` (which would otherwise restart the interval, and
  // therefore reset the elapsed-time baseline, on every tick).
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

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
  }, [timerOn]);

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
