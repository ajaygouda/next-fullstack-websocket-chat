// app/api/messages/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function GET(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const s = searchParams.get("senderId");
    const r = searchParams.get("receiverId");
    if (!s || !r) return NextResponse.json({ error: "Missing senderId/receiverId" }, { status: 400 });

    const messages = await Message.find({
        $or: [{ senderId: s, receiverId: r }, { senderId: r, receiverId: s }],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ messages });
}

export async function POST(req: Request) {
    await dbConnect();
    const { message, senderId, receiverId, createdAt, seen } = await req.json();
    if (!message || !senderId || !receiverId || !createdAt) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const msg = await Message.create({
        message,
        senderId,
        receiverId,
        createdAt,
        seen: seen ?? false,
    });

    return NextResponse.json({ data: msg }, { status: 201 });
}
