import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { RoomList, ChattingArea, Main } from './index.styled';

const Chat: NextPage = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io(`http://localhost:8000`, {
      transports: ['websocket'],
    });

    setCurrentSocket(socket);
  }, []);

  return (
    <Main>
      <RoomList socket={currentSocket} />
      <ChattingArea socket={currentSocket} />
    </Main>
  );
};

export default Chat;
