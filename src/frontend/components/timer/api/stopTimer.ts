import { UseStateBoolean } from '../../../../backend/types/useStateBoolean';

const stopTimer = (args: { setTimerOn: UseStateBoolean }) => {
  const { setTimerOn } = args;
  setTimerOn(false);
};

export default stopTimer;
