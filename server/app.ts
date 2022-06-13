import { Request, Response } from 'express';

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>test</h1>');
});

io.on('connection', () => {
  console.log('a user connected');
});

server.listen(8000, () => {
  console.log('listening chat project, port: 8000');
});
