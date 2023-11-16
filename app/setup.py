from setuptools import setup

setup(
    name='python app',
    version='0.1.0',    
    description='Webchat based on gradio',
    url='https://github.com/Makadoro/rivet-memgpt',
    packages=['pyapp'],
    install_requires=[
        'gradio',
        'requests',
        'json',
        'openai',
        'python-dotenv'
    ],
    classifiers=[],
)