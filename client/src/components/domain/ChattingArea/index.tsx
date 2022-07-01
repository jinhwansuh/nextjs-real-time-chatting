import styled from 'styled-components';
import { ChattingAreaProps } from '../../../types/chat';

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
        {chatList?.map((chat, index) =>
          mySocketId === chat.userSocketId ? (
            <StyledMyMsgWrapper key={chat.name + chat.message + index}>
              {chat.message}
            </StyledMyMsgWrapper>
          ) : (
            <StyledUserContainer key={chat.name + chat.message + index}>
              <div>
                <StyledName>{chat.name}</StyledName>
                <StyledFromUserWrapper>{chat.message}</StyledFromUserWrapper>
              </div>
            </StyledUserContainer>
          )
        )}
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

const StyledUserContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const StyledFromUserWrapper = styled.div`
  background-color: #ffffff;
  max-width: 300px;
  padding: 8px 12px;
  border-radius: 8px;
  border-top-left-radius: 0px;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -8px;
    width: 0px;
    height: 0px;
    border-left: 8px solid transparent;
    border-top: 8px solid #eee;
  }
`;
const StyledName = styled.span`
  display: block;
  font-size: 0.9em;
  padding-bottom: 4px;
`;

const StyledMyMsgWrapper = styled.div`
  background-color: #ffffff;
  max-width: 300px;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 20px;
  align-self: flex-end;
  word-break: break-word;
`;

export default ChattingArea;
