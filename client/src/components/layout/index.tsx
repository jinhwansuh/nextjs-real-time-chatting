import { FormEvent, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { user, userNameModal } from '../../atoms/user';

export default function Layout({ children }: any) {
  const [userState, setUserState] = useRecoilState(user);
  const [userNameModalState, setUserNameModalState] =
    useRecoilState(userNameModal);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userState.name.length === 0) {
      setUserNameModalState(true);
    }
  }, [userState.name]);

  const handleUserModal = (e: FormEvent<HTMLFormElement>) => {
    setUserState({ name: userName });
    setUserNameModalState(false);
    setUserName('');
  };

  if (userState.name.length === 0)
    return (
      <div style={{ display: userNameModalState ? 'block' : 'none' }}>
        <form onSubmit={handleUserModal}>
          이름을 입력해주세요.
          <div>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button> 확인 </button>
          </div>
        </form>
      </div>
    );

  return <>{children}</>;
}
