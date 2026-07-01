import { UseStateNumber } from '../../../../types/useStateNumber';

const clearTimer = (args: { setTime: UseStateNumber }) => {
  const { setTime } = args;

  setTime(0);
};

export default clearTimer;
