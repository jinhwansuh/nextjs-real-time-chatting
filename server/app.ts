const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://example.com',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('<h1>test</h1>');
});

io.on('connection', () => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening chat project, port: 3000');
});
