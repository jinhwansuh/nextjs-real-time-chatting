import { CSSProperties, memo } from 'react';
import styled from 'styled-components';

interface Props {
  message: string;
  style?: CSSProperties;
}
const ChatItem = ({ message }: Props) => {
  return (
    <>
      <StyledChatItem>{message}</StyledChatItem>
    </>
  );
};

const StyledChatItem = styled.div`
  margin: 5px 0;
  background-color: #eee;
  font-size: 18px;
`;

export default memo(ChatItem);
