import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Message } from "@/models/Message";

// GET /api/messages?senderId=xxx&receiverId=yyy
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const senderId = searchParams.get("senderId");
        const receiverId = searchParams.get("receiverId");

        if (!senderId || !receiverId) {
            return NextResponse.json(
                { error: "Missing senderId or receiverId" },
                { status: 400 }
            );
        }

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 }); // oldest → newest

        return NextResponse.json({ messages, status: 200 }, { status: 200 });
    } catch (error) {
        console.error("❌ Error in GET /api/messages:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: (error as Error).message },
            { status: 500 }
        );
    }
}

// POST /api/messages
export async function POST(request: Request) {
    try {
        await dbConnect();
        const { message, senderId, receiverId, createdAt, seen } =
            await request.json();

        if (!message || !senderId || !receiverId || !createdAt) {
            return NextResponse.json(
                { error: "Missing required fields", status: 400 },
                { status: 400 }
            );
        }

        const document = await Message.create({
            message,
            senderId,
            receiverId,
            createdAt,
            seen: typeof seen === "boolean" ? seen : false,
        });

        return NextResponse.json(
            { message: "Message Added", data: document, status: 201 },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Error in POST /api/messages:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: (error as Error).message },
            { status: 500 }
        );
    }
}
