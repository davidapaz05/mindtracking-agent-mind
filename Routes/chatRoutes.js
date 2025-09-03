import express from 'express';
import { chat } from '../Controller/chatController.js';

const chatRouter = express.Router();

chatRouter.post("/chat", async (req, res) => {
    try {
        const { message } = req.body; // pega só o campo certo
        if (!message) {
            return res.status(400).json({ error: "Mensagem não informada" });
        }
        const resposta = await chat(message);
        res.json({ resposta });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default chatRouter;