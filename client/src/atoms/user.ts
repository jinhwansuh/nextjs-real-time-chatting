import { atom } from 'recoil';

export const user = atom({
  key: 'userStateKey',
  default: {
    name: '',
  },
});

export const userNameModal = atom({
  key: 'userNameModalKey',
  default: false,
});
