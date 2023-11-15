// test.ts
import { runGraphInFile, startDebuggerServer, NodeDatasetProvider } from '@ironclad/rivet-node';
import dotenv from 'dotenv';
dotenv.config();

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 100;

// Global variable for chat history. Neccessary to launch chat loop with proper input
let chatHistory = { value: {} };

// project file path without file ending
const project = './memGPT';

const openAiKey = process.env.OPEN_AI_KEY;

/**
 * Loads datasets from a file with the given project name.
 * @returns A dataset provider object.
 */
async function loadDatasets() {
  try {
    const datasetProvider = await NodeDatasetProvider.fromDatasetsFile(project + '.rivet-data', { save: true });
    return datasetProvider;
  } catch (err) {
    console.error('Error loading datasets:', err);
  }
}
const datasetProvider = await loadDatasets();
// Already connect the debugger, so it is ready when we start using the graph
const debuggerServer = startDebuggerServer({});

function appendMessageToChatHistory(message) {
  // Parse chat_messages from a JSON string to a JavaScript array
  let chatMessages = JSON.parse(chatHistory.value.chat_messages);
  // Create a new message
  let newMessage = {
    type: 'user',
    message: message
  };
  // Append the new message to the array
  chatMessages.push(newMessage);
  // Stringify the array back to a JSON string
  let newChatMessages = JSON.stringify(chatMessages);
  // Set chatHistory.value.chat_messages to the new string
  chatHistory.value.chat_messages = newChatMessages;
}

function getChatHistoryObject() {
  // Parse chat_messages from a JSON string to a JavaScript array
  let chatMessages = JSON.parse(chatHistory.value.chat_messages);

  // Create a new object with chatMessages as the value
  let chatHistoryObject = {
    type: "chat-message[]",
    value: chatMessages
  };

  // Return the new object
  return chatHistoryObject;
}

/**
 * EXTERNAL FUNCTIONS
 * ------------------ 
 */

// Return first valid response + chat history
export async function getResponse(start_conversation, message) {
  // Select starting graph based on start_conversation
  const graph = start_conversation ? 'yebVxRtmTpuGTOzVJ-b2j' : '58feeDMBbRTnzveWL6PnP';
  let inputs = {};
  if(!start_conversation && chatHistory && chatHistory.value && chatHistory.value.chat_messages) {
    appendMessageToChatHistory(message);
    // console.log(chatHistory.value.chat_messages)
    console.log(chatHistory.value.response)
    console.log(message)
    // Inputs for chat loop (chat history)
    inputs = { 
      messages: getChatHistoryObject()
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      await runGraphInFile(project + '.rivet-project', {
        graph: graph,
        datasetProvider: datasetProvider,
        remoteDebugger: debuggerServer,
        inputs: inputs,
        context: {
          new_relic_api_key: process.env.NEW_RELIC_KEY,
          run_from_node: true
        },
        externalFunctions: {},
        onUserEvent: {
          return_chat_history: (data: DataValue): Promise<void> => {
            chatHistory = data;
            //console.log(data);
            resolve(data);
          }
        },
        openAiKey: openAiKey
      } as any);
    } catch (error) {
      reject(error);
    }
  });
}

/*
    text_to_speech: async (_context, response) => {
      //console.log(response);
      await textToSpeech(response, openAiKey);
      return {
        type: 'string',
        value: response
      };
    }
*/