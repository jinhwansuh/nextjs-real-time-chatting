import { FormEvent } from 'react';
import { CSSProperties } from 'styled-components';

export interface ServerToClientInitData {
  allUserCount: number;
  createdRoom: string[];
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
  allUser: ServerToClientInitData['allUserCount'];
  roomList: ServerToClientInitData['createdRoom'];
  clientInRoom: number;
  roomState: number | undefined;
  handleRoomChange: (e: string) => void;
}

export interface ChattingAreaProps extends Props {
  handleChatSubmit: (e: FormEvent<HTMLFormElement>) => void;
  chatInputState: string;
  setChatInputState: (e: any) => any;
  chatList: Message[];
}
