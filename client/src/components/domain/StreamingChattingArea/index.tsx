import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
import styled, { CSSProperties } from 'styled-components';
import { v4 } from 'uuid';
import { userStateAtom } from '../../../atoms/user';
import { Message } from '../../../types/chat';
import { VideoEventActions } from '../../../types/constants';
import ChatItem from './ChatItem';

interface Props {
  chatListState: Message[];
  roomId: string;
  currentSocket: Socket | undefined;
  style?: CSSProperties;
}

const StreamingChattingArea = ({
  chatListState,
  roomId,
  currentSocket,
  ...props
}: Props) => {
  const [chatInputState, setChatInputState] = useState('');
  const chattingRef = useRef<HTMLDivElement>(null);
  const userState = useRecoilValue(userStateAtom);

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Message = {
      id: v4(),
      name: userState.name,
      roomId: roomId as string,
      message: chatInputState,
      userSocketId: userState.userSocketId,
    };
    currentSocket?.emit(VideoEventActions.CHAT_MESSAGE, data);
    setChatInputState('');
  };

  useEffect(() => {
    chattingRef.current?.scrollTo(0, chattingRef.current.scrollHeight);
  }, [chatListState]);

  return (
    <>
      <StyledChattingContainer ref={chattingRef} {...props}>
        <StyledChattingWrapper>
          <StyledChatTitle>Live Chat</StyledChatTitle>

          {chatListState.map((chat) => (
            <ChatItem key={chat.id} message={chat.message} />
          ))}
        </StyledChattingWrapper>
        <StyledForm onSubmit={handleChatSubmit}>
          <StyledInput
            value={chatInputState}
            onChange={(e) => setChatInputState(e.target.value)}
          />
          <StyledButton type="submit" disabled={!chatInputState.trim().length}>
            전송
          </StyledButton>
        </StyledForm>
      </StyledChattingContainer>
    </>
  );
};

const StyledChattingContainer = styled.div`
  overflow-y: auto;
  position: relative;
  min-width: 350px;
  height: 500px;
`;
const StyledChattingWrapper = styled.div`
  min-height: calc(100% - 35px);
  position: relative;
`;
const StyledForm = styled.form`
  width: 100%;
  display: flex;
  height: 30px;
  background-color: #ffffff;
  box-sizing: border-box;
`;

const StyledChatTitle = styled.div`
  position: sticky;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: #e4b889;
  font-size: 25px;
`;

const StyledInput = styled.input`
  width: calc(100% - 50px);
`;
const StyledButton = styled.button`
  width: 50px;
`;

export default StreamingChattingArea;
