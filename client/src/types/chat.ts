import { FormEvent, RefObject } from 'react';
import { CSSProperties } from 'styled-components';

export type ServerRoomList = string[];

export interface ServerToClientInitData {
  allUserCount: number;
  createdRoom: ServerRoomList;
}

export interface Message {
  name: string;
  message: string;
  roomNumber: number;
}

export interface ServerToClientData extends Message {
  clientsInRoom: number;
}

export interface Props {
  style?: CSSProperties;
}

export interface RoomListProps extends Props {
  serverData: ServerToClientInitData | undefined;
  clientInRoom: number;
  roomState: number | undefined;
  handleRoomChange: (e: string) => void;
}

export interface ChattingAreaProps extends Props {
  chatInputState: string;
  containerRef: RefObject<HTMLDivElement>;
  chatList: Message[];
  handleChatSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setChatInputState: (e: any) => any;
}
