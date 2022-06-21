import { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { user } from '../../atoms/user';

const Layout = ({ children }: any) => {
  const [userState, setUserState] = useRecoilState(user);
  const [userName, setUserName] = useState('');

  const handleUserName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserState({ name: userName });
    setUserName('');
  };

  if (userState.name.length === 0)
    return (
      <main>
        <form onSubmit={handleUserName}>
          What is your name
          <div>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button> 확인 </button>
          </div>
        </form>
      </main>
    );

  return <>{children}</>;
};

export default Layout;
