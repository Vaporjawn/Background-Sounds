import { useState, useEffect } from 'react';
import startTimer from './api/startTimer';
import stopTimer from './api/stopTimer';

const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [timerOn, setTimerOn] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout = setInterval(() => {}, 1000);

    if (timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  return (
    <>
      <div>{time}</div>
      {!timerOn && <button onClick={() => startTimer({ setTimerOn, setTime })}>Start</button>}
      {timerOn && <button onClick={() => stopTimer({ setTimerOn, setTime })}>Stop</button>}
    </>
  );
};

export default Timer;
