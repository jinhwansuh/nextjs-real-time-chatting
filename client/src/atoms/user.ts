import { atom } from 'recoil';

export const user = atom({
  key: 'userStateKey',
  default: {
    name: '',
  },
});
