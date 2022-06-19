import { NextPage } from 'next';
import React from 'react';

import { RoomList, ChattingArea, Main } from './index.styled';

const Chat: NextPage = () => {
  return (
    <Main>
      <RoomList />
      <ChattingArea />
    </Main>
  );
};

export default Chat;
