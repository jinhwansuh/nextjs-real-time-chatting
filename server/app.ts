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

const app = express();
const server = http.createServer(app);
const cors = require('cors');

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

const findTargetRoom = (roomList: ServerChatRoom[], id: string) => {
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
    const targetRoom = findTargetRoom(chatRoomList, data.roomId);
    if (targetRoom?._id) {
      socket.join(targetRoom._id);

      const clientsInRoom =
        chattingNamespace.adapter.rooms.get(targetRoom._id)?.size || 0; // 방 유저

      const serverToClientData: ServerToClientData = {
        ...data,
        message: `${data.name}님이 입장하셨습니다.`,
        clientsInRoom,
      };

      /* 
      socket.to(chatRoomList[num]).emit(ChatEventActions.JOIN_ROOM, serverToClientData); 
      위 동작으로 하면 안되는 이유가 무엇인지 
      problem: 자기 자신이 join 했을때 이벤트가 발생하지 않는다.
      즉, 본인이 emit한 이벤트는 다시 on을 하지 않음 probably(broadcast 처럼?)
    */
      currentNameSpace
        .to(targetRoom._id)
        .emit(ChatEventActions.JOIN_ROOM, serverToClientData);
    }
  });

  socket.on(ChatEventActions.LEAVE_ROOM, (data: Message) => {
    const targetRoom = findTargetRoom(chatRoomList, data.roomId);
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
    const targetRoom = findTargetRoom(chatRoomList, data.roomId);
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
  console.log('someone connected streamingChannel', socket.id);

  const clientsCount = io.engine.clientsCount;

  socket.emit(VideoEventActions.WELCOME, {
    allUserCount: clientsCount,
    createdRoom: streamingRoomList,
  } as ServerToClientInitData);

  socket.on(VideoEventActions.BROADCASTER, (room: string) => {
    // room: random unique string
    broadcasters[room] = socket.id;
    socket.join(room);
    socket.broadcast.emit(VideoEventActions.BROADCASTER);
  });
  socket.on(VideoEventActions.WATCHER, (user) => {
    /* 
      user = {
        room: inputRoomNumber.value,
        name: inputName.value,
      };
    */
    socket.join(user.room);
    user.id = socket.id;
    /* 
      user = {
        room: inputRoomNumber.value,
        name: inputName.value,
        id: socket.id
      };
    */
    socket.to(broadcasters[user.room]).emit(VideoEventActions.WATCHER, user);
  });
  socket.on(VideoEventActions.OFFER, (id, event) => {
    console.log('아이이디이다', id);
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

  socket.on('disconnect', () => {
    console.log('someone disconnected streamingChannel', socket.id);
    // socket.to(broadcaster).emit(VideoEventActions.DISCONNECT_PEER, socket.id);
  });
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
