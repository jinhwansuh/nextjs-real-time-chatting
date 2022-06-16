import { atom } from 'recoil';

export const userState = atom({
  key: 'userStateKey',
  default: {
    name: '',
  },
});
