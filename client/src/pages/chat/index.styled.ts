import styled from 'styled-components';

import BaseRoomList from './RoomList/RoomList';
import BaseChattingArea from './ChattingArea/ChattingArea';

const Main = styled.main`
  display: flex;
  width: 1100px;
  height: 650px;
  margin: 20px auto;
  border: 1px solid #ddd;
`;

const RoomList = styled(BaseRoomList)`
  width: 240px;
  background: #fcfcfc;
`;

const ChattingArea = styled(BaseChattingArea)`
  flex: 1;
`;

export { Main, RoomList, ChattingArea };
