const express = require('express');
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require('../models/Conversation');
const {verifyToken} = require('../middlewares/authMiddleware')

router.post("/", verifyToken, async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        const savedMessageId = savedMessage._id;
        const conversation = await Conversation.findById(req.body.conversationId)
        
        if(!conversation){
            return res.status(404).json('conversation not found')
        }

        conversation.messages.push(savedMessageId);
        await conversation.save();
        
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/:conversationId",verifyToken, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;