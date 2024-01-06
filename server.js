const express = require("express")
const { Readable } = require('stream');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// Create a writable stream to save the data to a file
const outputStream = fs.createWriteStream('output.mp4');

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Listen for the 'stream' event and handle the incoming media stream
    socket.on('stream', (arrayBuffer) => {
      let buffer = Buffer.from(arrayBuffer);
      let stream = new Readable();
      if (stream instanceof require('stream').Readable) {
        console.log('This is a readable stream');
       } else if (stream instanceof require('stream').Writable) {
        console.log('This is a writable stream');
       } else if (stream instanceof require('stream').Duplex) {
        console.log('This is a duplex stream');
       } else if (stream instanceof require('stream').Transform) {
        console.log('This is a transform stream');
       } else {
        console.log('Unknown stream type');
       }    
        console.log('Received stream from client');
        stream._read = () => {}; // _read is required but you can noop it
        stream.push(buffer);
        stream.push(null);
     
        // Now you can use fluent-ffmpeg with the stream
        var FfmpegCommand = require('fluent-ffmpeg');
        var command = new FfmpegCommand();
        command.input(stream)
          .audioCodec('libmp3lame')
          .output('outputfile.mp3')
          .run();
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');

        // Close the file stream when the user disconnects
        outputStream.end();
        

        // Convert the saved data to an MP4 file using ffmpeg
        const command = 'ffmpeg -i outputfile.mp3 -c copy final_output.mp3';
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during ffmpeg conversion: ${error}`);
            } else {
                console.log('Conversion successful');
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
