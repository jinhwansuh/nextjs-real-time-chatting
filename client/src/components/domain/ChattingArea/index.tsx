import styled from 'styled-components';
import { ChattingAreaProps } from '../../../types/chat';
import ChatItem from './ChatItem';

function ChattingArea({
  chatList,
  containerRef,
  handleChatSubmit,
  chatInputState,
  setChatInputState,
  mySocketId,
  ...props
}: ChattingAreaProps) {
  return (
    <StyledContainer {...props} ref={containerRef}>
      <StyledEmailWrapper>
        {chatList?.map((chat) => {
          const fromMe = mySocketId === chat.userSocketId;

          return (
            <ChatItem
              id={chat.id}
              message={chat.message}
              name={chat.name}
              fromMe={fromMe}
            />
          );
        })}
      </StyledEmailWrapper>
      <StyledForm onSubmit={handleChatSubmit}>
        <StyledTextArea
          value={chatInputState}
          onChange={(e) => setChatInputState(e.target.value)}
        />
        <StyledButton type="submit" disabled={!chatInputState.trim().length}>
          전송
        </StyledButton>
      </StyledForm>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  overflow-y: auto;
  background-color: #eee;
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

export default ChattingArea;
