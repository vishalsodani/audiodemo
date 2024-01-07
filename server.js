const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const { Readable } = require('stream');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

wss.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (pcmData) => {
        // Process the received PCM data (e.g., save to file, encode to MP3)
        savePcmDataToFile(pcmData);
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

function savePcmDataToFile(pcmData) {
    // Save the PCM data to a file (example: pcm-data.raw)
    fs.appendFileSync('pcm-data.raw', pcmData);
    // const pcmIntArray = new Int16Array(pcmData);
    // const pcmBuffer = Buffer.from(pcmIntArray.buffer);

    // // Create a Readable stream from the PCM data
    // const pcmStream = new Readable();
    // pcmStream._read = () => {};
    // pcmStream.push(pcmBuffer);
    // pcmStream.push(null);

    // // Set up ffmpeg command
    // const command = ffmpeg();
    // command.input(pcmStream)
    //     .inputFormat('s16le')  // Specify input format (16-bit signed little-endian PCM)
    //     .audioCodec('libmp3lame')  // Specify MP3 audio codec
    //     .audioBitrate(128)  // Specify bitrate for MP3
    //     .on('end', () => {
    //         console.log('Conversion finished');
    //     })
    //     .on('error', (err) => {
    //         console.error('Error:', err);
    //     });

    // // Save MP3 file
    // command.save('output.mp3');
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
