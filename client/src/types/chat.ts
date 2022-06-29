import { FormEvent, RefObject } from 'react';
import { CSSProperties } from 'styled-components';

export type ServerChatRoom = {
  _id: string;
  roomName: string;
  roomUser: string[];
};

export interface UserAtom {
  name: string;
  userSocketId: string;
}

export interface ServerToClientInitData {
  allUserCount: number;
  createdRoom: ServerChatRoom[];
}

export interface Message {
  name: string;
  message: string;
  roomId: string;
  userSocketId: UserAtom['userSocketId'];
}

export interface ServerToClientData extends Message {
  clientsInRoom: number;
}

export interface Props {
  style?: CSSProperties;
}

export interface RoomState {
  id: string;
  name: string;
}

export interface RoomListProps extends Props {
  serverData: ServerToClientInitData | undefined;
  clientInRoom: number;
  roomState: RoomState;
  handleRoomChange: (e: RoomState) => void;
}

export interface ChattingAreaProps extends Props {
  mySocketId: UserAtom['userSocketId'];
  chatInputState: string;
  containerRef: RefObject<HTMLDivElement>;
  chatList: Message[];
  handleChatSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setChatInputState: (e: any) => any;
}
