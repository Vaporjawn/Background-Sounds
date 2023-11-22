import { UseStateBoolean } from '../../../../backend/types/useStateBoolean';
import { UseStateNumber } from '../../../../backend/types/useStateNumber';

const startTimer = (args: { setTimerOn: UseStateBoolean; setTime: UseStateNumber }) => {
  const { setTimerOn, setTime } = args;
  setTime(0);
  setTimerOn(true);
};

export default startTimer;
