import { UseStateNumber } from '../../../../backend/types/useStateNumber';
import clearTimer from '../api/clearTimer';

const TimerClearButton = (args: { timerOn: boolean; setTime: UseStateNumber }) => {
  const { timerOn, setTime } = args;

  return <>{!timerOn && <button onClick={() => clearTimer({ setTime })}>Clear</button>}</>;
};

export default TimerClearButton;
