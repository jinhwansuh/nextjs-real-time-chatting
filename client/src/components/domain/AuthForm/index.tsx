import { FormEvent, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { userStateAtom } from '../../../atoms/user';
import { SESSION_USER_KEY } from '../../../constants/sessionStorage';

const AuthForm = () => {
  const [userState, setUserState] = useRecoilState(userStateAtom);
  const [userName, setUserName] = useState('');
  const uuid = useMemo(() => v4(), []);

  const handleUserName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputUserName = userName.trim();
    if (inputUserName !== '') {
      setUserState({ name: inputUserName, userSocketId: uuid });
      sessionStorage.setItem(SESSION_USER_KEY, inputUserName);
      setUserName('');
    }
  };

  return (
    <StyledMain>
      <h1>What is your name?</h1>
      <StyledForm onSubmit={handleUserName}>
        <StyledInput
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <StyledButton disabled={userName.length === 0}>Next</StyledButton>
      </StyledForm>
    </StyledMain>
  );
};

const StyledMain = styled.main`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
`;
const StyledForm = styled.form`
  margin-top: 40px;
  width: 50%;
  display: flex;
  flex-direction: column;
`;
const StyledInput = styled.input`
  display: block;
  border: none;
  border-bottom: 1px solid #ddd;
  width: 100%;
  height: 50px;
  font-size: 20px;
  padding-left: 20px;
  &:focus {
    outline: none;
    border-bottom: 2px solid black;
  }
`;

const StyledButton = styled.button`
  display: block;
  margin-top: 30px;
  width: 50%;
  height: 40px;
  align-self: center;
  border: none;
  text-align: start;
  padding-left: 20px;
  background-color: #d8cece;
  cursor: pointer;
  &:disabled &:hover {
    background-color: #aaa;
  }
`;
export default AuthForm;
