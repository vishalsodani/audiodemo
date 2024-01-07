command to convert raw pcm into mp3

`ffmpeg -f s16le -ar 44100 -ac 2 -i pcm-data.raw -b:a 128k outputpcm.mp3`