import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { userState } from '../../atoms/user';
import { Message, ServerToClientInitData } from '../../types/chat';
import { RoomList, ChattingArea, Main } from './index.styled';

const Chat: NextPage = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [serverState, setServerState] = useState<ServerToClientInitData>({});
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const [roomState, setRoomState] = useState<number>();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    const socket = io(`http://localhost:8000`, {
      transports: ['websocket'],
    });

    socket.on('welcome', (data: ServerToClientInitData) => {
      setServerState({ ...data });
    });

    setCurrentSocket(socket);
  }, []);

  useEffect(() => {
    currentSocket?.on('chat-message', (data: Message) => {
      console.log(data);
      setChatListState([...chatListState, data]);
    });

    currentSocket?.on('leaveRoom', (data: Message) => {
      console.log(data);
      setChatListState([
        ...chatListState,
        {
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방을 퇴장하셨습니다.`,
        },
      ]);
    });

    currentSocket?.on('joinRoom', (data: Message) => {
      console.log(data);
      setChatListState([
        ...chatListState,
        {
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방에 입장하셨습니다.`,
        },
      ]);
    });
  }, [chatListState, currentSocket, roomState]);

  const handleRoomChange = (roomNumber: string) => {
    setRoomState(Number(roomNumber));
    setChatListState([]);
    if (roomState)
      currentSocket?.emit('leaveRoom', {
        roomNumber: roomState,
        name: user.name,
      });
    currentSocket?.emit('joinRoom', {
      roomNumber: Number(roomNumber),
      name: user.name,
    });
  };

  return (
    <Main>
      {currentSocket && (
        <>
          <RoomList
            socket={currentSocket}
            allUser={serverState?.allUser}
            roomList={serverState?.createdRoom}
            handleRoomChange={handleRoomChange}
          />
          <ChattingArea
            socket={currentSocket}
            roomNumber={roomState}
            chatList={chatListState}
          />
        </>
      )}
    </Main>
  );
};

export default Chat;
