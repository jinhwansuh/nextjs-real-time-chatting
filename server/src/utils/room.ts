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
    streamer: 'John Doe',
    roomName: 'If you created a room, click this room to watch streaming',
    roomUser: [],
    isLive: true,
  },
  {
    _id: '567567',
    streamer: 'Hong',
    roomName: 'Dummy1',
    roomUser: [],
    isLive: false,
  },
  {
    _id: '789789567',
    streamer: 'Jae Won',
    roomName: 'Dummy2',
    roomUser: [],
    isLive: true,
  },
];
