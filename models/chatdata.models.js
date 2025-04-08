const { model, Schema } = require("mongoose");

const chatDAtaSchema = new Schema(
  {
    socketId: String,
    username: String,
    message: String,
    type: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ChatData = model("chatdata", chatDAtaSchema)


module.exports = ChatData;