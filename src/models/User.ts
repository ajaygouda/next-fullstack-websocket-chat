import { IUser } from "@/types/IUser";
import mongoose, { Schema, Model } from "mongoose";


const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: String },
    profilePic: { type: String },
    status: { type: String, default: "offline" },
    createdAt: { type: Date, default: Date.now }
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
