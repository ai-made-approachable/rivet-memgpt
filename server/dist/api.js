import express from "express";
const app = express();
app.use(express.json());
const PORT = 8085;
app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
app.post('/message', async (req, res) => {
    const body = req.body;
    if (!body || !body.message) {
        return res.status(418).send({ message: "No message provided" });
    }
    if (!body.start_conversation) {
        body.start_conversation = false;
    }
    try {
        const result = await mockResult();
        return res.status(200).send({ status: result });
    }
    catch (error) {
        return res.status(500).send({ message: "An error occured" });
    }
});
function mockResult() {
    return new Promise((resolve, reject) => {
        // Simulate async operation
        setTimeout(() => {
            resolve({ message: 'Hello, how can I help you?' });
        }, 2000);
    });
}
// Input/Output examples
// Store the chat-messages object in server app or pass it around from chat to server app and back!?
const input = {
    "message": {
        "type": "user",
        "message": "Hallo"
    },
    "start_conversation": true
};
const output = {
    "response": "Hallo, wie kann ich dir helfen?"
};
//# sourceMappingURL=api.js.map