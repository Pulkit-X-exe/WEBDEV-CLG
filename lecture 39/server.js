const ws = require('ws');
const webserver = new ws.Server({ port: 8080 });

webserver.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.send(`Server received: ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

