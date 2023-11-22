import { UseStateBoolean } from '../../../../backend/types/useStateBoolean';
import { UseStateNumber } from '../../../../backend/types/useStateNumber';

const stopTimer = (args: { setTimerOn: UseStateBoolean; setTime: UseStateNumber }) => {
  const { setTimerOn, setTime } = args;
  setTimerOn(false);
  setTime(0);
};

export default stopTimer;
