import React, { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { userState } from '../../../atoms/user';
import { ChattingAreaProps, Message } from '../../../types/chat';

function EmailArea({
  socket,
  chatList,
  roomNumber,
  ...props
}: ChattingAreaProps) {
  const [chatState, setChatState] = useState('');
  const [user, setUser] = useRecoilState(userState);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('chat-message', {
      name: user.name,
      roomNumber: roomNumber,
      message: chatState,
    } as Message);
    setChatState('');
  };

  return (
    <StyledContainer {...props}>
      <StyledEmailWrapper>
        {chatList.length > 0 &&
          chatList?.map((chat, index) => (
            <li key={chat.name + index}>
              {chat.name} : {chat.message}
            </li>
          ))}
      </StyledEmailWrapper>
      <StyledForm onSubmit={handleSubmit}>
        <StyledTextArea
          // onKeyPress={handleKeyPress}
          value={chatState}
          onChange={(e) => setChatState(e.target.value)}
        />
        <StyledButton type="submit" disabled={!chatState.trim().length}>
          전송
        </StyledButton>
      </StyledForm>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #eee;
  }
`;

const StyledEmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 30px;
  min-height: calc(100% - (65px + 12px));
  box-sizing: border-box;
`;

const StyledForm = styled.form`
  position: sticky;
  bottom: 0px;
  width: 100%;
  height: calc(65px + 12px);
  display: flex;
  background-color: #ffffff;
  padding: 6px;
  box-sizing: border-box;
`;

const StyledTextArea = styled.input`
  height: 100%;
  flex: 1;
  margin-right: 5px;
  padding: 6px;
  resize: none;
  box-sizing: border-box;
`;
const StyledButton = styled.button`
  height: 100%;
  width: 45px;
`;

export default EmailArea;
