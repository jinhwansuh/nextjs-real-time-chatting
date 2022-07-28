import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';
import { user } from '../atoms/user';

const useUserState = () => {
  const [userState, setUserState] = useRecoilState(user);
  const uuid = useMemo(() => v4(), []);
  const router = useRouter();

  useEffect(() => {
    const storedName = sessionStorage.getItem('test--name');

    if (storedName) {
      setUserState({ name: storedName, userSocketId: uuid });
    } else {
      router.push('/user');
    }
  }, []);

  return userState;
};

export default useUserState;
