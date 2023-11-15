import express from "express";
import { getResponse } from "./rivet_runner.js";
import dotenv from 'dotenv';
dotenv.config();
const openAiKey = process.env.OPEN_AI_KEY;
const app = express();
app.use(express.json());
const PORT = 8085;
app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
app.post('/message', async (req, res) => {
    const body = req.body;
    if (!body || !body.message) {
        res.status(418).send({ message: "No message provided" });
    }
    if (!body.start_conversation) {
        body.start_conversation = false;
    }
    if (body.message === "/exit") {
        res.status(200).send({ "message": "Event: The user has logged out" });
    }
    try {
        const result = await getResponse(body.start_conversation, body.message).then(chatHistory => {
            console.log(chatHistory.value.response);
            // Voice output of AI response
            //textToSpeech(chatHistory.value.response, openAiKey);
            return chatHistory.value.response;
        }).catch(error => {
            console.error('Error running project file:', error);
        });
        res.status(200).send({ message: result });
    }
    catch (error) {
        res.status(500).send({ message: "An error occured" });
    }
});
//# sourceMappingURL=api.js.map