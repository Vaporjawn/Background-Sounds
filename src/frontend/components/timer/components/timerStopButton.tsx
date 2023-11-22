import { UseStateBoolean } from '../../../../backend/types/useStateBoolean';
import stopTimer from '../api/stopTimer';

const TimerStopButton = (args: { timerOn: boolean; setTimerOn: UseStateBoolean }) => {
  const { setTimerOn, timerOn } = args;

  return <>{timerOn && <button onClick={() => stopTimer({ setTimerOn })}>Stop</button>}</>;
};

export default TimerStopButton;
