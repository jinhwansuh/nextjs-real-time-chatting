import { NextPage } from 'next';
import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { user } from '../../atoms/user';
import Layout from '../../components/layout';
import {
  Message,
  ServerToClientData,
  ServerToClientInitData,
} from '../../types/chat';
import type { NextPageWithLayout } from '../_app';
import { RoomList, ChattingArea, Main } from './index.styled';

const Chat: NextPageWithLayout = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [serverState, setServerState] = useState<ServerToClientInitData>({
    allUserCount: 0,
    createdRoom: [],
  });
  const [clientInCurrentRoom, setClientInCurrentRoom] = useState(0);
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const [roomState, setRoomState] = useState<number>();
  const [chatInputState, setChatInputState] = useState('');
  const userState = useRecoilValue(user);

  useEffect(() => {
    const socket = io(`http://localhost:8000`, {
      transports: ['websocket'],
    });

    socket.on('welcome', (data: ServerToClientInitData) => {
      setServerState({ ...data });
    });

    setCurrentSocket(socket);

    socket.on('chat-message', (data: Message) => {
      setChatListState((prev) => [...prev, data]);
    });

    socket.on('leaveRoom', (data: ServerToClientData) => {
      setClientInCurrentRoom((prev) => prev - 1);
      setChatListState((prev) => [
        ...prev,
        {
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방을 퇴장하셨습니다.`,
        },
      ]);
    });

    socket.on('joinRoom', (data: ServerToClientData) => {
      setClientInCurrentRoom(data.clientsInRoom);
      setChatListState((prev) => [
        ...prev,
        {
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방에 입장하셨습니다.`,
        },
      ]);
    });

    socket.on('leavePage', (data: number) => {
      setServerState((prev) => ({
        ...prev,
        allUserCount: data,
      }));
    });

    return () => {
      socket.off('connect');
      // socket.off('disconnect');
      // socket.off('pong');
    };
  }, []);

  const handleRoomChange = (number: string) => {
    const roomNumber = Number(number);
    if (roomState !== roomNumber) {
      setRoomState(roomNumber);
      setChatListState([]);
      setClientInCurrentRoom(0);
      if (roomState! >= 0)
        currentSocket?.emit('leaveRoom', {
          roomNumber: roomState,
          name: userState.name,
        });
      currentSocket?.emit('joinRoom', {
        roomNumber: roomNumber,
        name: userState.name,
      });
    }
  };

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    currentSocket?.emit('chat-message', {
      name: userState.name,
      roomNumber: roomState,
      message: chatInputState,
    } as Message);
    setChatInputState('');
  };

  return (
    <Main>
      {currentSocket && (
        <>
          <RoomList
            roomState={roomState}
            socket={currentSocket}
            allUser={serverState?.allUserCount}
            roomList={serverState?.createdRoom}
            clientInRoom={clientInCurrentRoom}
            handleRoomChange={handleRoomChange}
          />
          <ChattingArea
            socket={currentSocket}
            chatList={chatListState}
            handleChatSubmit={handleChatSubmit}
            chatInputState={chatInputState}
            setChatInputState={setChatInputState}
          />
        </>
      )}
    </Main>
  );
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Chat;
