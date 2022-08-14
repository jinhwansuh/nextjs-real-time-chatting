import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';
import { user } from '../atoms/user';
import { AuthForm } from '../components/domain';
import { SESSION_USER_KEY } from '../constants/sessionStorage';

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  const [userState, setUserState] = useRecoilState(user);
  const [initPageLoading, setInitPageLoading] = useState(true);
  const uuid = useMemo(() => v4(), []);

  useEffect(() => {
    const storedName = window.sessionStorage.getItem(SESSION_USER_KEY);
    if (storedName && !userState.name) {
      setUserState({ name: storedName, userSocketId: uuid });
    }

    setInitPageLoading(false);
  }, []);

  if (initPageLoading && !userState.name) {
    return <div>init page loading...</div>;
  }

  if (!initPageLoading && !userState.name) {
    return <AuthForm />;
  }

  return <>{children}</>;
};

export default AuthLayout;
