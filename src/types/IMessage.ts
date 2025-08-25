import { ObjectId } from "mongoose";

export interface IMessage {
    _id?: ObjectId;
    senderId: ObjectId;
    receiverId: ObjectId;
    message: string;
    createdAt?: Date;
    seen?: boolean;
}
