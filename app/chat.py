import os
import gradio as gr
import openai
import random
import time
import json

# Get openai key from config
with open('key.json') as f:
    data = json.load(f)
    openai.api_key = data['openAiKey']

with gr.Blocks() as demo:
    chatbot = gr.Chatbot()
    msg = gr.Textbox()
    msg2 = gr.Audio(sources=["microphone"], type="filepath", label="Record your voice")
    clear = gr.ClearButton([msg, chatbot])

    import random
    import time

    def respond(message, chat_history):
        """
        This function generates a random response to a given message and appends the message and response to the chat history.

        Args:
            message (str): The message to respond to.
            chat_history (list): A list of tuples containing the chat history.

        Returns:
            tuple: A tuple containing an empty string and the updated chat history.
        """
        # Generate a random response
        bot_message = random.choice(["How are you?", "I love you", "I'm very hungry"])
        # Append the message and response to the chat history
        chat_history.append((message, bot_message))
        # Wait for 2 seconds
        time.sleep(2)
        # Return an empty string and the updated chat history
        return "", chat_history

    msg.submit(respond, [msg2, chatbot], [msg2, chatbot])

demo.launch()