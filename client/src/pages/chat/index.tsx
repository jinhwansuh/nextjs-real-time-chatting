import { NextPage } from 'next';
import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { user } from '../../atoms/user';
import Layout from '../../components/layout';
import {
  Message,
  ServerToClientData,
  ServerToClientInitData,
} from '../../types/chat';
import { ChatEventActions } from '../../types/constants';
import type { NextPageWithLayout } from '../_app';
import { RoomList, ChattingArea, Main } from './index.styled';

const Chat: NextPageWithLayout = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [serverState, setServerState] = useState<ServerToClientInitData>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [clientInCurrentRoom, setClientInCurrentRoom] = useState(0);
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const [roomState, setRoomState] = useState<number>();
  const [chatInputState, setChatInputState] = useState('');
  const [userState, setUserState] = useRecoilState(user);

  useEffect(() => {
    const socket = io(`http://localhost:8000`, {
      transports: ['websocket'],
    });

    socket.on(ChatEventActions.WELCOME, (data: ServerToClientInitData) => {
      setServerState({ ...data });
    });

    setCurrentSocket(socket);

    socket.on(ChatEventActions.CHAT_MESSAGE, (data: Message) => {
      setChatListState((prev) => [...prev, data]);
    });

    socket.on(ChatEventActions.LEAVE_ROOM, (data: ServerToClientData) => {
      setClientInCurrentRoom((prev) => prev - 1);
      setChatListState((prev) => [
        ...prev,
        {
          userSocketId: data.userSocketId,
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방을 퇴장하셨습니다.`,
        },
      ]);
    });

    socket.on(ChatEventActions.JOIN_ROOM, (data: ServerToClientData) => {
      setClientInCurrentRoom(data.clientsInRoom);
      setChatListState((prev) => [
        ...prev,
        {
          userSocketId: data.userSocketId,
          name: data.name,
          roomNumber: data.roomNumber,
          message: `${data.roomNumber}번 방에 입장하셨습니다.`,
        },
      ]);
    });

    socket.on(ChatEventActions.LEAVE_PAGE, (data: number) => {
      setServerState(
        (prev) =>
          ({
            ...prev,
            allUserCount: data,
          } as ServerToClientInitData)
      );
    });

    return () => {
      socket.emit(ChatEventActions.LEAVE_PAGE, {});
      socket.close();
    };
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [chatListState]);

  const handleRoomChange = (number: string) => {
    const roomNumber = Number(number);
    if (roomState !== roomNumber) {
      setRoomState(roomNumber);
      setChatListState([]);
      setClientInCurrentRoom(0);
      if (roomState !== undefined)
        currentSocket?.emit(ChatEventActions.LEAVE_ROOM, {
          roomNumber: roomState,
          name: userState.name,
          userSocketId: userState.userSocketId,
        });
      currentSocket?.emit(ChatEventActions.JOIN_ROOM, {
        roomNumber: roomNumber,
        name: userState.name,
        userSocketId: userState.userSocketId,
      });
    }
  };

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    currentSocket?.emit(ChatEventActions.CHAT_MESSAGE, {
      name: userState.name,
      roomNumber: roomState,
      message: chatInputState,
      userSocketId: userState.userSocketId,
    } as Message);
    setChatInputState('');
  };

  return (
    <Main>
      <RoomList
        roomState={roomState}
        serverData={serverState}
        clientInRoom={clientInCurrentRoom}
        handleRoomChange={handleRoomChange}
      />
      <ChattingArea
        mySocketId={userState.userSocketId}
        chatList={chatListState}
        containerRef={containerRef}
        handleChatSubmit={handleChatSubmit}
        chatInputState={chatInputState}
        setChatInputState={setChatInputState}
      />
    </Main>
  );
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Chat;
