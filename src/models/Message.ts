import { IMessage } from "@/types/IMessage";
import mongoose, { Schema, Model } from "mongoose";

const MessageSchema: Schema<IMessage> = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false }
});

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
