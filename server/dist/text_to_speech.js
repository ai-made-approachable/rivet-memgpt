import fs from 'fs';
import fetch from 'node-fetch';
import playSound from 'play-sound';
export const textToSpeech = async (data, openAiKey) => {
    const player = playSound();
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
            response_format: 'mp3'
        })
    });
    const audioBuffer = await response.arrayBuffer();
    // Write the audioBuffer to a file
    await fs.promises.writeFile('audio.mp3', Buffer.from(audioBuffer));
    // Play the audio file and return a Promise that resolves when the audio finishes playing
    return new Promise((resolve, reject) => {
        player.play('audio.mp3', (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
};
//# sourceMappingURL=text_to_speech.js.map