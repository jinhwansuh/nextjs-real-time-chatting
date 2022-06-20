import { FormEvent, MouseEvent, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { CSSProperties } from 'styled-components';

export interface ServerToClientInitData {
  allUser: string[];
  room: any;
  createdRoom: string[];
}

export interface Message {
  name: string;
  message: string;
  roomNumber: number;
}

export interface ChatProps {
  socket: Socket;
  style?: CSSProperties;
}

export interface RoomListProps extends ChatProps {
  allUser: ServerToClientInitData['allUser'];
  roomList: ServerToClientInitData['createdRoom'];
  roomState: number | undefined;
  handleRoomChange: (e: string) => void;
}

export interface ChattingAreaProps extends ChatProps {
  handleChatSubmit: (e: FormEvent<HTMLFormElement>) => void;
  chatInputState: string;
  setChatInputState: any;
  chatList: Message[];
}
