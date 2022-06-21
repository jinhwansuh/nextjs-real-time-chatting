import { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { user } from '../../atoms/user';

export default function Layout({ children }: any) {
  const [userState, setUserState] = useRecoilState(user);
  const [userName, setUserName] = useState('');

  const handleUserName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserState({ name: userName });
    setUserName('');
  };

  if (userState.name.length === 0)
    return (
      <div>
        <form onSubmit={handleUserName}>
          이름을 입력해주세요. ~~
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
