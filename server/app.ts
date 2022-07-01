import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {
  ChatEventActions,
  VideoEventActions,
} from '../client/src/types/constants';
import {
  Message,
  ServerChatRoom,
  ServerToClientData,
  ServerToClientInitData,
} from '../client/src/types/chat';
import { chatRoomList, streamingRoomList } from './src/utils/room';
import { ServerStreamingRoom } from '../client/src/types/streaming';

const app = express();
const server = http.createServer(app);
const cors = require('cors');

const PORT = 8000;

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('<h1>test</h1>');
});
app.get('/streaming', (req: express.Request, res: express.Response) => {
  res.send(JSON.stringify(streamingRoomList));
});

const chattingNamespace = io.of('/chatting');
const streamingNamespace = io.of('/streaming');

// chatting

const findChatTargetRoom = (roomList: ServerChatRoom[], id: string) => {
  return roomList.find((room) => room._id === id);
};
const findStreamingTargetRoom = (
  roomList: ServerStreamingRoom[],
  id: string
) => {
  return roomList.find((room) => room._id === id);
};

chattingNamespace.on('connection', (socket) => {
  const currentNameSpace = socket.nsp;

  console.log('someone connected chattingChannel', socket.id);

  const clientsCount = io.engine.clientsCount;

  currentNameSpace.emit(ChatEventActions.WELCOME, {
    allUserCount: clientsCount,
    createdRoom: chatRoomList,
  } as ServerToClientInitData);

  socket.on(ChatEventActions.JOIN_ROOM, (data: Message) => {
    const targetRoom = findChatTargetRoom(chatRoomList, data.roomId);
    if (targetRoom?._id) {
      socket.join(targetRoom._id);

      const clientsInRoom =
        chattingNamespace.adapter.rooms.get(targetRoom._id)?.size || 0; // 방 유저

      const serverToClientData: ServerToClientData = {
        ...data,
        message: `${data.name}님이 입장하셨습니다.`,
        clientsInRoom,
      };
      currentNameSpace
        .to(targetRoom._id)
        .emit(ChatEventActions.JOIN_ROOM, serverToClientData);
    }
  });

  socket.on(ChatEventActions.LEAVE_ROOM, (data: Message) => {
    const targetRoom = findChatTargetRoom(chatRoomList, data.roomId);
    if (targetRoom?._id) {
      socket.leave(targetRoom._id);

      const clientsInRoom =
        chattingNamespace.adapter.rooms.get(targetRoom._id)?.size || 0;
      const serverToClientData: ServerToClientData = {
        ...data,
        message: `${data.name} 님이 퇴장하셨습니다.`,
        clientsInRoom,
      };
      currentNameSpace
        .to(targetRoom._id)
        .emit(ChatEventActions.LEAVE_ROOM, serverToClientData);
    }
  });

  socket.on(ChatEventActions.CHAT_MESSAGE, (data: Message) => {
    const targetRoom = findChatTargetRoom(chatRoomList, data.roomId);
    currentNameSpace
      .to(targetRoom!._id)
      .emit(ChatEventActions.CHAT_MESSAGE, data);
  });

  socket.on('disconnect', () => {
    console.log('someone disconnected chattingChannel', socket.id);
    const clientsCount = io.engine.clientsCount;
    socket.broadcast.emit(ChatEventActions.LEAVE_PAGE, clientsCount);
  });
});

// live streaming
/* 
  const streamingList = [
    {
      _id: uuid
      streamer: socket.id,
      roomName: 'john Room',
      roomUser: []
    }
  ]
*/
let broadcasters: any = {};

streamingNamespace.on('connection', (socket) => {
  const currentNameSpace = socket.nsp;

  console.log('someone connected streamingChannel', socket.id);

  socket.on('disconnect', () => {
    console.log('someone disconnected streamingChannel', socket.id);
    // socket.to(broadcaster).emit(VideoEventActions.DISCONNECT_PEER, socket.id);
  });

  // Streaming Channel communication 수정 필요

  socket.on(VideoEventActions.ENTER_ROOM, (data: Message) => {
    socket.join(data.roomId);

    const clientsInRoom =
      chattingNamespace.adapter.rooms.get(data.roomId)?.size || 0; // 방 유저

    const serverToClientData: ServerToClientData = {
      ...data,
      message: `${data.name}님이 입장하셨습니다.`,
      clientsInRoom,
    };
    currentNameSpace
      .to(data.roomId)
      .emit(ChatEventActions.CHAT_MESSAGE, serverToClientData);
  });

  socket.on(VideoEventActions.LEAVE_ROOM, (data: Message) => {
    socket.leave(data.roomId);

    const clientsInRoom =
      chattingNamespace.adapter.rooms.get(data.roomId)?.size || 0;
    const serverToClientData: ServerToClientData = {
      ...data,
      message: `${data.name} 님이 퇴장하셨습니다.`,
      clientsInRoom,
    };
    socket
      .to(data.roomId)
      .emit(ChatEventActions.CHAT_MESSAGE, serverToClientData);
  });

  socket.on(VideoEventActions.CHAT_MESSAGE, (data: Message) => {
    currentNameSpace.to(data.roomId).emit(ChatEventActions.CHAT_MESSAGE, data);
  });

  // Streaming Video communication
  socket.on(VideoEventActions.BROADCASTER, (broadcasterRoomId: string) => {
    // room: random unique string
    broadcasters[broadcasterRoomId] = socket.id;
    socket.join(broadcasterRoomId);
    socket.broadcast.emit(VideoEventActions.BROADCASTER);
  });
  socket.on(VideoEventActions.WATCHER, (user) => {
    socket.join(user.roomId);
    user.id = socket.id;
    socket.to(broadcasters[user.roomId]).emit(VideoEventActions.WATCHER, user);
  });
  socket.on(VideoEventActions.OFFER, (id, event) => {
    socket.to(id).emit(VideoEventActions.OFFER, socket.id, event);
  });
  socket.on(VideoEventActions.ANSWER, (id, event) => {
    socket
      .to(id) // broadcaster id
      .emit(VideoEventActions.ANSWER, socket.id, event);
  });
  socket.on(VideoEventActions.CANDIDATE, (id, message) => {
    socket.to(id).emit(VideoEventActions.CANDIDATE, socket.id, message);
  });
});

server.listen(PORT, () => {
  console.log(`listening chat project, port: ${PORT}`);
});
