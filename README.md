# rivet-memgpt
This project intends to rebuild the general [MemGPT](https://memgpt.ai/) idea in Rivet, which is a no-code solution that allows to create complex graphs handling AI applications.
The goal is not to recreate it exactely, but to add the main functionalities and then extend/improve upon them.

## About the project
Currently the project has multiple parts
1. The rivet graph itself: "memGPT.rivet-project". This file can be run in the [Rivet App](https://rivet.ironcladapp.com/) itself and contains most of the functionalities.
2. This graph can also be run via a node.js/typeScript application in /server/. That allows it to be hosted as a backend and can also be used to add more functionalities. To get this running you will need to set OPEN_AI_KEY in your .env file in the workspace directory
3. There is also a python app which creates a chat-interface using gradio in /app/

## Current status
- Most of the MemGPT features are integrated (core_memory, recall_memory, archival_memory) and it works well with gpt-4
- Using the /server/ backend application + the /app/ frontend application, a chat interface can be used

## Next steps
- [ ] Change graph behavior, so that new gpt-4-turbo and newer gpt-3-turbo versions, will work better (maybe add inner thoughts as a function instead if they can do multi function calling (send_message + send_inner_thoughts) consistently
- [x] Create a proper chat-interface including voice-input. It needs to have an API so LLM responses from Rivet can be pushed in
- [ ] Allow the usage of multiple data stores and swapping them
- [ ] Create a full setup (personas, human, data sources to be used, gpt model) procedure
