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
    roomName: 'Live test',
    roomUser: [],
    isLive: true,
  },
  {
    _id: '567567',
    streamer: 'Hong',
    roomName: 'Not live',
    roomUser: [],
    isLive: false,
  },
  {
    _id: '789789567',
    streamer: 'Jae Won',
    roomName: 'Not Live2',
    roomUser: [],
    isLive: false,
  },
];
