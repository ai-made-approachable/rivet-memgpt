from gradio_client import Client
client = Client("http://127.0.0.1:7860/")
client.view_api(return_format="dict")
job = client.submit(["hello"], api_name="/chat")
job.result()