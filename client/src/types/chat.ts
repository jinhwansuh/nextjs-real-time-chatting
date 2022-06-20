import { Socket } from 'socket.io-client';
import { CSSProperties } from 'styled-components';

export interface Message {
  name: string;
  data: string;
}

export interface ChatProps {
  socket: Socket | undefined;
  style?: CSSProperties;
}
