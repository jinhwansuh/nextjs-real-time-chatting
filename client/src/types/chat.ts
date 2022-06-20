import { Socket } from 'socket.io-client';
import { CSSProperties } from 'styled-components';

export interface Message {
  name: string;
  data: string;
}

export interface ChatProps {
  socket: Socket;
  style?: CSSProperties;
}

export interface ServerToClientInitData {
  allUser: string[];
  room: any;
  createdRoom: string[];
}
