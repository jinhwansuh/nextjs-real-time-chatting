import { atom } from 'recoil';
import { UserAtom } from '../types/chat';

export const userStateAtom = atom<UserAtom>({
  key: 'userStateKey',
  default: {
    name: '',
    userSocketId: '',
  },
});
