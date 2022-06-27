import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {
  ChatEventActions,
  VideoEventActions,
} from '../client/src/types/constants';
import {
  Message,
  ServerRoomList,
  ServerToClientData,
  ServerToClientInitData,
} from '../client/src/types/chat';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('<h1>test</h1>');
});

let room: ServerRoomList = ['DefaultRoom0', 'DefaultRoom1', 'DefaultRoom2'];

/* 이런식으로 방의 형식 변경하기 
  const ChatRoomList = [
    {
      index: 0,
      roomName: 'room1',
      roomUser: [],
    },
  ]; 
*/

/* 
  const VideoRoomList = [
    {
      streamer: 'john Doe - id',
      roomName: 'john Room',
      roomUser: []
    }
  ]
*/

const videoMap = {};
let broadcaster: string = '';

io.on('connection', (socket) => {
  console.log('someone connected Index', socket.id);

  // chatting
  const clientsCount = io.engine.clientsCount;

  io.emit(ChatEventActions.WELCOME, {
    allUserCount: clientsCount,
    createdRoom: room,
  } as ServerToClientInitData);

  socket.on(ChatEventActions.JOIN_ROOM, (data: Message) => {
    const num = data.roomNumber;
    socket.join(room[num]);

    const clientsInRoom = io.sockets.adapter.rooms.get(room[num])?.size || 0; // 방 유저
    const serverToClientData: ServerToClientData = { ...data, clientsInRoom };

    socket.to(room[num]).emit(ChatEventActions.JOIN_ROOM, serverToClientData);
  });

  socket.on(ChatEventActions.LEAVE_ROOM, (data: Message) => {
    const num = data.roomNumber;
    socket.leave(room[num]);

    const clientsInRoom = io.sockets.adapter.rooms.get(room[num])?.size || 0;
    const serverToClientData: ServerToClientData = { ...data, clientsInRoom };
    io.to(room[num]).emit(ChatEventActions.LEAVE_ROOM, serverToClientData);
  });

  socket.on(ChatEventActions.CHAT_MESSAGE, (data: Message) => {
    const num = data.roomNumber;
    io.to(room[num]).emit(ChatEventActions.CHAT_MESSAGE, data);
  });

  socket.on('disconnect', () => {
    console.log('someone disconnected', socket.id);
    const clientsCount = io.engine.clientsCount;
    io.emit(ChatEventActions.LEAVE_PAGE, clientsCount);
    socket.to(broadcaster).emit(VideoEventActions.DISCONNECT_PEER, socket.id);
  });

  // live streaming

  socket.on(VideoEventActions.BROADCASTER, () => {
    broadcaster = socket.id;
    socket.broadcast.emit(VideoEventActions.BROADCASTER);
  });
  socket.on(VideoEventActions.WATCHER, () => {
    socket.to(broadcaster).emit(VideoEventActions.WATCHER, socket.id);
  });
  socket.on(VideoEventActions.OFFER, (id, message) => {
    socket.to(id).emit(VideoEventActions.OFFER, socket.id, message);
  });
  socket.on(VideoEventActions.ANSWER, (id, message) => {
    socket.to(id).emit(VideoEventActions.ANSWER, socket.id, message);
  });
  socket.on(VideoEventActions.CANDIDATE, (id, message) => {
    socket.to(id).emit(VideoEventActions.CANDIDATE, socket.id, message);
  });
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
