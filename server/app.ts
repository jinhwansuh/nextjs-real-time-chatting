import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
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

let room: ServerRoomList = ['room0', 'room1', 'room2'];

// let ss = [
//   {
//     index: 0,
//     roomName: 'room1',
//     roomUser: 0,
//   },
// ];

io.on('connection', (socket) => {
  console.log('someone connected Index', socket.id);

  const clientsCount = io.engine.clientsCount; // 전체 유저

  io.emit('welcome', {
    allUserCount: clientsCount,
    createdRoom: room,
  } as ServerToClientInitData);

  socket.on('joinRoom', (data: Message) => {
    const num = data.roomNumber;
    socket.join(room[num]);

    const clientsInRoom = io.sockets.adapter.rooms.get(room[num])?.size || 0; // 방 유저
    const serverToClientData: ServerToClientData = { ...data, clientsInRoom };

    io.to(room[num]).emit('joinRoom', serverToClientData);
  });

  socket.on('leaveRoom', (data: Message) => {
    const num = data.roomNumber;
    socket.leave(room[num]);

    const clientsInRoom = io.sockets.adapter.rooms.get(room[num])?.size || 0;
    const serverToClientData: ServerToClientData = { ...data, clientsInRoom };
    io.to(room[num]).emit('leaveRoom', serverToClientData);
  });

  socket.on('chat-message', (data: Message) => {
    const num = data.roomNumber;
    io.to(room[num]).emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    console.log('someone disconnected', socket.id);
    const clientsCount = io.engine.clientsCount; // 전체 유저
    io.emit('leavePage', clientsCount);
  });
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
