import gradio as gr
import json
from openai import OpenAI

# Get openai key from config
with open("key.json") as f:
    data = json.load(f)
    api_key = data["openAiKey"]

client = OpenAI(api_key=api_key)


# Get message either from text or audio
def retrieve_message(message, history, audio, clear):
    # Get the user input either from audio or from text
    if audio:
        user_input = transcribe_audio(audio)
    else:
        user_input = message
    # Return the assistants input here
    return user_input

# Use openai to transcribe audio file
def transcribe_audio(audio):
    audio_file = open(audio, "rb")
    transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
    return transcript.text

demo = gr.ChatInterface(
    fn=retrieve_message,
    title="MemGPT",
    textbox=gr.Textbox(
        placeholder="Verfasse hier deine Antwort", container=False, scale=7
    ),
    additional_inputs=[
        gr.Audio(sources=["microphone"], label="Speak", type="filepath"),
        #gr.ClearButton("audio_input"),
    ],
    submit_btn="Abschicken",
    retry_btn=None,
    undo_btn=None,
    clear_btn=None,
    chatbot=gr.Chatbot(
        avatar_images=[
            "https://files.oaiusercontent.com/file-8lKLS02Q7fc70GD4HGT3Fwgp?se=2023-11-12T12%3A37%3A49Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D2c898f81-e907-4adc-8625-235b271f82a1.webp&sig=AuVp72MSzgqmJRqsxZI%2BmCtSOBQqI2GCrRkbv8fAjEs%3D",
            "https://files.oaiusercontent.com/file-1tU7eUavgU9wYb5aRVNpAq3v?se=2023-11-12T12%3A39%3A13Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D7bb2cd2c-87b9-483f-a3df-7b374962baf7.webp&sig=JZRFKtrb79tO7CQQEd50Z/VMPXl7HokRi1Tm93oei94%3D",
        ]
    )
)
demo.launch(share=False)

