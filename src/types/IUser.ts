import { ObjectId } from "mongoose";

export interface IUser {
    _id?: ObjectId;
    email: string;
    password: string;
    username: string;
    phone?: string;
    profilePic?: string;
    status?: "online" | "offline" | "busy";
    createdAt?: Date;
}
