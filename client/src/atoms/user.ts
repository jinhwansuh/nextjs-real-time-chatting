import { atom } from 'recoil';
import { UserAtom } from '../types/chat';

export const user = atom<UserAtom>({
  key: 'userStateKey',
  default: {
    name: '',
    userSocketId: '',
  },
});
