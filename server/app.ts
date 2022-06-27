import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ChatEventTypes, VideoEventTypes } from '../client/src/types/constants';
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

  io.emit(ChatEventTypes.welcome, {
    allUserCount: clientsCount,
    createdRoom: room,
  } as ServerToClientInitData);

  socket.on(ChatEventTypes.joinRoom, (data: Message) => {
    const num = data.roomNumber;
    socket.join(room[num]);

    const clientsInRoom = io.sockets.adapter.rooms.get(room[num])?.size || 0; // 방 유저
    const serverToClientData: ServerToClientData = { ...data, clientsInRoom };

    socket.to(room[num]).emit(ChatEventTypes.joinRoom, serverToClientData);
  });

  socket.on(ChatEventTypes.leaveRoom, (data: Message) => {
    const num = data.roomNumber;
    socket.leave(room[num]);

    const clientsInRoom = io.sockets.adapter.rooms.get(room[num])?.size || 0;
    const serverToClientData: ServerToClientData = { ...data, clientsInRoom };
    io.to(room[num]).emit(ChatEventTypes.leaveRoom, serverToClientData);
  });

  socket.on(ChatEventTypes['chat-message'], (data: Message) => {
    const num = data.roomNumber;
    io.to(room[num]).emit(ChatEventTypes['chat-message'], data);
  });

  socket.on('disconnect', () => {
    console.log('someone disconnected', socket.id);
    const clientsCount = io.engine.clientsCount;
    io.emit('leavePage', clientsCount);
    socket.to(broadcaster).emit('disconnectPeer', socket.id);
  });

  // live streaming

  socket.on(VideoEventTypes.broadcaster, () => {
    broadcaster = socket.id;
    socket.broadcast.emit(VideoEventTypes.broadcaster);
  });
  socket.on(VideoEventTypes.watcher, () => {
    socket.to(broadcaster).emit(VideoEventTypes.watcher, socket.id);
  });
  socket.on(VideoEventTypes.offer, (id, message) => {
    socket.to(id).emit(VideoEventTypes.offer, socket.id, message);
  });
  socket.on(VideoEventTypes.answer, (id, message) => {
    socket.to(id).emit(VideoEventTypes.answer, socket.id, message);
  });
  socket.on(VideoEventTypes.candidate, (id, message) => {
    socket.to(id).emit(VideoEventTypes.candidate, socket.id, message);
  });
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
