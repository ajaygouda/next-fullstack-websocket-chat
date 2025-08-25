"use client"
import { useEffect, useState } from "react";
import ChatBoardHeader from "./chatBoardHeader";
import ChatType from "./chatType";
import { IMessage } from "@/types/IMessage";
import { io } from "socket.io-client";
import { socket } from "@/lib/socket";




export default function CharBoard({ receiver, sender }: any) {
    const [chats, setChats] = useState<IMessage[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");



    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    // Send new message
    const handleChat = (e: any) => {
        e.preventDefault()
        if (!message.trim()) return;
        socket.emit("send_message", {
            senderId: sender._id,
            receiverId: receiver._id,
            message,
            createdAt: new Date(),
            seen: false
        });
        setMessage("");
    };

    console.log("chats", chats)

    return (
        <div className="flex flex-1 flex-col w-full justify-between">
            {receiver &&
                <ChatBoardHeader receiver={receiver} />}
            <div className="p-6 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
                {chats?.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex py-1 ${chat.senderId === sender._id ? "justify-end" : "justify-start"}`}
                    >
                        <span
                            className={`inline-block text-[14px] px-3 py-2 rounded-lg shadow ${chat.senderId === sender._id ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        >
                            {chat.message}
                        </span>
                    </div>
                ))}

            </div>
            {receiver && sender && <ChatType receiver={receiver} sender={sender} handleChat={handleChat} setMessage={setMessage} message={message} />}
        </div>
    )
}