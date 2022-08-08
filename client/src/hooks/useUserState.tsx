import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';
import { user } from '../atoms/user';
import { SESSION_USER_KEY } from '../constants/sessionStorage';

const useUserState = () => {
  const [userState, setUserState] = useRecoilState(user);
  const uuid = useMemo(() => v4(), []);
  const router = useRouter();

  useEffect(() => {
    if (userState.name) return;

    const storedName = window.sessionStorage.getItem(SESSION_USER_KEY);
    if (storedName && !userState.name) {
      setUserState({ name: storedName, userSocketId: uuid });
    } else if (!storedName) {
      router.push('/user');
    }
  }, []);

  return userState;
};

export default useUserState;
