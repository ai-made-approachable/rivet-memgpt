import fs from 'fs';
import fetch from 'node-fetch';
import playSound from 'play-sound';
export const textToSpeech = async (data, openAiKey, getFile) => {
    const player = playSound();
    const format = 'mp3';
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
            input: data,
            model: 'tts-1',
            voice: 'alloy',
            speed: 1,
            response_format: format
        })
    });
    const audioBuffer = await response.arrayBuffer();
    // Write the audioBuffer to a file
    await fs.promises.writeFile('audio.' + format, Buffer.from(audioBuffer));
    if (!getFile) {
        // Play the audio file and return a Promise that resolves when the audio finishes playing
        return new Promise((resolve, reject) => {
            player.play('audio' + format, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    else {
        const data = await fs.promises.readFile('audio.' + format);
        // Convert the buffer to a 16-bit int array
        const audioData = new Int16Array(data.buffer);
        // Return the sample rate and the audio data
        return [44100, audioData];
    }
};
//# sourceMappingURL=text_to_speech.js.map