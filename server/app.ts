import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Message, ServerToClientInitData } from '../client/src/types/chat';

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

// const chatRoom1 = io.of('/room1');
// chatRoom1.on('connection', (socket: Socket) => {
//   console.log('room1: a user connected');
//   socket.on('chat message', (message: Message) => {
//     io.emit('send message', message);
//   });
// });

// const chatRoom2 = io.of('/room2');
// chatRoom2.on('connection', (socket: Socket) => {
//   console.log('room2: a user connected');
//   socket.on('chat message', (message: Message) => {
//     io.emit('send message', message);
//   });
// });
let room = ['room1', 'room2', 'room3'];

const allUser = new Set();

io.on('connection', (socket) => {
  console.log('someone connected Index');

  allUser.add(socket.id);

  io.emit('welcome', {
    allUser: [...allUser],
    room: socket.rooms,
    createdRoom: room,
  } as ServerToClientInitData);

  socket.on('joinRoom', (data: Message) => {
    console.log('join : ', data);
    const num = data.roomNumber;
    socket.join(room[num]);
    io.to(room[num]).emit('joinRoom', data);
  });

  socket.on('leaveRoom', (data: Message) => {
    console.log('leave : ', data);
    const num = data.roomNumber;
    socket.leave(room[num]);
    io.to(room[num]).emit('leaveRoom', data);
  });

  socket.on('chat-message', (data: Message) => {
    console.log('message : ', data);
    const num = data.roomNumber;
    io.to(room[num]).emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    console.log('someone disconnected');
    const disconnectedUser = socket.id;
    allUser.delete(disconnectedUser);
    io.emit('bye', {});
  });
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
