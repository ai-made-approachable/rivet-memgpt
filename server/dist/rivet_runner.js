import { runGraphInFile, startDebuggerServer, NodeDatasetProvider } from '@ironclad/rivet-node';
import { textToSpeech } from './text_to_speech.js';
import { transcribeAudioFromMic } from './speech_input.js';
import dotenv from 'dotenv';
dotenv.config();
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 100;
// project file path without file ending
const project = './memGPT';
const graph = 'yebVxRtmTpuGTOzVJ-b2j';
const openAiKey = process.env.OPEN_AI_KEY;
async function loadDatasets() {
    try {
        const datasetProvider = await NodeDatasetProvider.fromDatasetsFile(project + '.rivet-data');
        return datasetProvider;
    }
    catch (err) {
        console.error('Error loading datasets:', err);
    }
}
const debuggerServer = startDebuggerServer({
    port: 8081
});
const datasetProvider = await loadDatasets();
await runGraphInFile(project + '.rivet-project', {
    graph: graph,
    datasetProvider: datasetProvider,
    remoteDebugger: debuggerServer,
    inputs: {},
    context: {
        new_relic_api_key: process.env.NEW_RELIC_KEY,
        run_from_node: true
    },
    externalFunctions: {
        getUserInput: async function main() {
            const apiKey = openAiKey;
            const transcript = await transcribeAudioFromMic(apiKey);
            console.log(transcript);
            return {
                type: 'string',
                value: transcript
            };
        },
        text_to_speech: async (_context, response) => {
            //console.log(response);
            await textToSpeech(response, openAiKey);
            return {
                type: 'string',
                value: response
            };
        },
    },
    onUserEvent: {},
    openAiKey: openAiKey
});
//# sourceMappingURL=rivet_runner.js.map