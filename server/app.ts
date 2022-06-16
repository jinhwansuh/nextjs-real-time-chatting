import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

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

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('chat message', (message: Message) => {
    io.emit('send message', message);
  });
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
