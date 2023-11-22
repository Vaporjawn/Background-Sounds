import { UseStateBoolean } from '../../../../backend/types/useStateBoolean';

const startTimer = (args: { setTimerOn: UseStateBoolean }) => {
  const { setTimerOn } = args;
  setTimerOn(true);
};

export default startTimer;
