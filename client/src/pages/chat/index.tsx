import { NextPage } from 'next';
import styled from 'styled-components';
import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { user } from '../../atoms/user';
import Layout from '../../components/layout';
import {
  Message,
  RoomState,
  ServerToClientData,
  ServerToClientInitData,
} from '../../types/chat';
import { ChatEventActions } from '../../types/constants';
import type { NextPageWithLayout } from '../_app';
import { ChattingArea, RoomList } from '../../components/domain';

const Chat: NextPageWithLayout = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [serverState, setServerState] = useState<ServerToClientInitData>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [clientInCurrentRoom, setClientInCurrentRoom] = useState(0);
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const [roomState, setRoomState] = useState<RoomState>({
    id: '',
    name: '',
  });
  const [chatInputState, setChatInputState] = useState('');
  const [userState, setUserState] = useRecoilState(user);

  useEffect(() => {
    const socket = io(`http://localhost:8000/chatting`, {
      transports: ['websocket'],
    });

    socket.on(ChatEventActions.WELCOME, (data: ServerToClientInitData) => {
      console.log(data);
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
          roomId: data.roomId,
          message: data.message,
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
          roomId: data.roomId,
          message: data.message,
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
      // socket.emit(ChatEventActions.LEAVE_PAGE, {});
      socket.close();
    };
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [chatListState]);

  const handleRoomChange = (room: RoomState) => {
    if (roomState.id !== room.id) {
      setRoomState(room);
      setChatListState([]);
      if (roomState !== undefined)
        currentSocket?.emit(ChatEventActions.LEAVE_ROOM, {
          roomId: roomState.id,
          name: userState.name,
          userSocketId: userState.userSocketId,
        });
      currentSocket?.emit(ChatEventActions.JOIN_ROOM, {
        roomId: room.id,
        name: userState.name,
        userSocketId: userState.userSocketId,
      });
    }
  };

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomState.id !== '') {
      currentSocket?.emit(ChatEventActions.CHAT_MESSAGE, {
        name: userState.name,
        roomId: roomState.id,
        message: chatInputState,
        userSocketId: userState.userSocketId,
      } as Message);
      setChatInputState('');
    }
  };

  return (
    <Main>
      <StyledRoomList
        roomState={roomState}
        serverData={serverState}
        clientInRoom={clientInCurrentRoom}
        handleRoomChange={handleRoomChange}
      />
      <StyledChattingArea
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
const Main = styled.main`
  width: 850px;
  height: 650px;
  border: 1px solid #ddd;
`;

const StyledRoomList = styled(RoomList)`
  width: 200px;
  background: #fcfcfc;
`;

const StyledChattingArea = styled(ChattingArea)`
  flex: 1;
`;

Chat.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Chat;
