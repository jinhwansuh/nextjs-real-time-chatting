import { Request, Response } from 'express';

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

interface Message {
  name: string;
  data: string;
}

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req: Request, res: Response) => {
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
