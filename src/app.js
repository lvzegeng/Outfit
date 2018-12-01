import { message } from 'antd';

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      message.error(err.message);
    },
  },
};
