// Install the required packages using npm:
// npm install express socket.io

const express = require('express');
const https = require('http');
const fs = require('fs');
// const options = {
//     key: fs.readFileSync('/home/alien/webrtc/testnodesocket/test-node-socketio/server/newssl/key.pem'),
// cert: fs.readFileSync('/home/alien/webrtc/testnodesocket/test-node-socketio/server/newssl/cert.pem')
// };

const socketIO = require('socket.io');

const app = express();
const server = https.createServer(app);
const io = socketIO(server);

// Serve HTML file with audio streaming page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for audio data from the client
  socket.on('audioData', (data) => {
    // Broadcast the received audio data to all connected clients (excluding the sender)
    socket.broadcast.emit('audioData', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
