import { IChat } from "@/types/IChat";
import mongoose, { Schema, Model } from "mongoose";


const ChatSchema: Schema<IChat> = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
