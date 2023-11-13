import fs from 'fs';
import mic from 'mic';
import { Readable } from 'stream';
import readline from 'readline';
import OpenAI from 'openai';
// Record audio
function recordAudio(filename) {
    return new Promise((resolve, reject) => {
        const micInstance = mic({
            rate: "16000",
            channels: "1",
            fileType: "wav",
        });
        const micInputStream = micInstance.getAudioStream();
        const output = fs.createWriteStream(filename);
        const writable = new Readable().wrap(micInputStream);
        console.log("Recording... Press Enter to stop");
        writable.pipe(output);
        micInstance.start();
        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.on('keypress', (str, key) => {
            if (key.name === 'return') {
                micInstance.stop();
                console.log("Finished recording");
                resolve(void 0);
            }
        });
        micInputStream.on("error", (err) => {
            reject(err);
        });
    });
}
async function transcribeAudio(filename, apiKey) {
    const client = new OpenAI({ apiKey });
    const transcript = await client.audio.transcriptions.create({
        file: fs.createReadStream(filename),
        model: "whisper-1"
    });
    return transcript.text;
}
// Exported function
export async function transcribeAudioFromMic(apiKey) {
    const audioFilename = "recorded_audio.wav";
    await recordAudio(audioFilename);
    return await transcribeAudio(audioFilename, apiKey);
}
//# sourceMappingURL=speech_input.js.map