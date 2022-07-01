import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
import styled, { CSSProperties } from 'styled-components';
import { v4 } from 'uuid';
import { user } from '../../../atoms/user';
import { Message } from '../../../types/chat';
import { VideoEventActions } from '../../../types/constants';

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
  const userState = useRecoilValue(user);

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Message = {
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
          {chatListState.map((chat) => (
            <StyledChatItem key={v4()}>
              {chat.name} : {chat.message}
            </StyledChatItem>
          ))}
        </StyledChattingWrapper>
        <StyledForm onSubmit={handleChatSubmit}>
          <input
            value={chatInputState}
            onChange={(e) => setChatInputState(e.target.value)}
          />
          <button type="submit" disabled={!chatInputState.trim().length}>
            전송
          </button>
        </StyledForm>
      </StyledChattingContainer>
    </>
  );
};

const StyledChattingContainer = styled.div`
  overflow-y: auto;
  position: relative;
  background-color: #eee;
  width: 80%;
  height: 200px;
`;
const StyledChattingWrapper = styled.div`
  min-height: calc(100% - 25px);
`;
const StyledForm = styled.form`
  position: sticky;
  bottom: 0px;
  width: 100%;
  display: flex;
  height: 25px;
  background-color: #ffffff;
  /* padding: 6px; */
  box-sizing: border-box;
`;

const StyledChatItem = styled.div`
  background-color: #ababef;
`;

export default StreamingChattingArea;
