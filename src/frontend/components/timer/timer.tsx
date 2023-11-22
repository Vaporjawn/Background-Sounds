import { useState, useEffect } from 'react';
import TimerClearButton from './components/timerClearButton';
import TimerStartButton from './components/timerStartButton';
import TimerStopButton from './components/timerStopButton';

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [timerOn, setTimerOn] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout = setInterval(() => {}, 10);

    if (timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 0.01);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
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
