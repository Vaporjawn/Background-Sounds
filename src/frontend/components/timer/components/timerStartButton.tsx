import { UseStateBoolean } from '../../../../backend/types/useStateBoolean';
import startTimer from '../api/startTimer';

const TimerStartButton = (args: { timerOn: boolean; setTimerOn: UseStateBoolean }) => {
  const { setTimerOn, timerOn } = args;

  return <>{!timerOn && <button onClick={() => startTimer({ setTimerOn })}>Start</button>}</>;
};

export default TimerStartButton;
