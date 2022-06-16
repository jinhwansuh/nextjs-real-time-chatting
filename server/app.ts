import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);

interface Message {
  name: string;
  data: string;
}

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

const user = new Set();

io.on('connection', (socket: Socket) => {
  console.log('someone connected Index');

  user.add(socket.id);

  io.emit('welcome', {
    time: [...user],
  });

  socket.on('chat message', (message: Message) => {
    io.emit('send message', message);
  });

  socket.on('disconnect', () => {
    const disconnectedUser = socket.id;
    user.delete(disconnectedUser);
    io.emit('bye', {});
  });
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
