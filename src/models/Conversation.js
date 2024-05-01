const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);