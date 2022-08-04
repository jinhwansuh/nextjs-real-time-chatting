import { memo } from 'react';
import styled from 'styled-components';

interface ChatItemProps {
  id: string;
  message: string;
  name?: string;
  fromMe: boolean;
}

const ChatItem = ({ id, message, name, fromMe }: ChatItemProps) => {
  return (
    <>
      {fromMe ? (
        <StyledMyMsgWrapper key={id}>{message}</StyledMyMsgWrapper>
      ) : (
        <StyledUserContainer key={id}>
          <div>
            <StyledName>{name}</StyledName>
            <StyledFromUserWrapper>{message}</StyledFromUserWrapper>
          </div>
        </StyledUserContainer>
      )}
    </>
  );
};

const StyledMyMsgWrapper = styled.div`
  background-color: #ffffff;
  max-width: 300px;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 20px;
  align-self: flex-end;
  word-break: break-word;
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

export default memo(ChatItem);
