import { ObjectId } from "mongoose";

export interface IChat {
    _id?: ObjectId;
    participants: ObjectId[]; // 2 users
    lastMessage?: string;
    updatedAt?: Date;
}
