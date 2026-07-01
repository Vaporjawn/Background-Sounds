import { useState, useEffect, useRef } from 'react';
import TimerClearButton from './components/timerClearButton';
import TimerStartButton from './components/timerStartButton';
import TimerStopButton from './components/timerStopButton';

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (timerOn) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 0.01);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

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
