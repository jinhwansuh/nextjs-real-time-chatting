import { ServerChatRoom } from '../../../client/src/types/chat';
import { ServerStreamingRoom } from '../../../client/src/types/streaming';

export const chatRoomList: ServerChatRoom[] = [
  {
    _id: '112356',
    roomName: 'Room0',
    roomUser: [],
  },
  {
    _id: '11235611',
    roomName: 'Room1',
    roomUser: [],
  },
  {
    _id: '11235655',
    roomName: 'Room2',
    roomUser: [],
  },
];

export const streamingRoomList: ServerStreamingRoom[] = [
  {
    _id: '123',
    streamer: 'jin',
    roomName: 'ma first Stream',
    roomUser: [],
    isLive: true,
  },
];
