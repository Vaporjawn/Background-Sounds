import { UseStateBoolean } from '../../../../types/useStateBoolean';

const stopTimer = (args: { setTimerOn: UseStateBoolean }) => {
  const { setTimerOn } = args;
  setTimerOn(false);
};

export default stopTimer;
