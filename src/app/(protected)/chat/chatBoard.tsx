"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import ChatBoardHeader from "./chatBoardHeader";
import ChatType from "./chatType";
import { IMessage } from "@/types/IMessage";
import { getSocket } from "@/lib/socket-client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function ChatBoard({ receiver, sender }: any) {
    const [chats, setChats] = useState<IMessage[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<any>(null);
    const chatContainerRef:any = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]); // runs every time chats change

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/messages?senderId=${sender._id}&receiverId=${receiver._id}`
                );
                const data = await response.json();
                if (data.messages) {
                    setChats(data.messages);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoading(false);
            }
        };

        if (sender?._id && receiver?._id) {
            fetchMessages();
        }
    }, [sender?._id, receiver?._id]);

    // Socket.IO connection - setup once
    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        const handleConnect = () => {
            console.log("Connected to server");
            setIsConnected(true);

            // Register user with their ID
            if (sender?._id) {
                socketInstance.emit("register", sender._id);
                console.log("Registered user:", sender._id);
            }
        };

        const handleDisconnect = () => {
            console.log("Disconnected from server");
            setIsConnected(false);
        };

        // Private message event listener
        const handlePrivateMessage = (newMessage: IMessage) => {
            console.log("Received private message:", newMessage);
            // Only add message if it's relevant to current chat
            if (
                (newMessage.senderId === sender._id && newMessage.receiverId === receiver._id) ||
                (newMessage.senderId === receiver._id && newMessage.receiverId === sender._id)
            ) {
                setChats((prev) => [...prev, newMessage]);
            }
        };

        socketInstance.on("connect", handleConnect);
        socketInstance.on("disconnect", handleDisconnect);
        socketInstance.on("private_message", handlePrivateMessage);

        // Manually trigger connection if not connected
        if (!socketInstance.connected) {
            socketInstance.connect();
        }

        // Cleanup on component unmount
        return () => {
            socketInstance.off("connect", handleConnect);
            socketInstance.off("disconnect", handleDisconnect);
            socketInstance.off("private_message", handlePrivateMessage);
        };
    }, [sender?._id, receiver?._id]);

    // ✅ Send message function
    const handleChat = useCallback(async () => {
        if (message.trim() && isConnected && socket) {
            const newMessage = {
                message: message,
                senderId: sender._id,
                receiverId: receiver._id,
                createdAt: new Date(),
                seen: false,
            };

            try {
                // Send message via API
                const response = await fetch(`${BASE_URL}/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMessage),
                });

                if (response.ok) {
                    // Emit private message via socket
                    socket.emit("private_message", newMessage);
                    console.log("Emitted private message:", newMessage);
                    setMessage("");

                    // Also add to local state immediately for instant feedback
                    //setChats(prev => [...prev, newMessage]);
                }
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    }, [message, isConnected, socket, sender?._id, receiver?._id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col w-full justify-between">
            {receiver && <ChatBoardHeader receiver={receiver} />}

            {/* Connection status indicator */}
            {/* <div className={`p-2 text-center ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div> */}

            {/* Messages list */}
            <div ref={chatContainerRef} className="p-6 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full h-[calc(100vh-120px)] overflow-y-auto">
                {chats?.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex py-1 ${chat.senderId === sender._id
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        <span
                            className={`inline-block text-[14px] px-3 py-2 rounded-lg shadow ${chat.senderId === sender._id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                                }`}
                        >
                            {chat.message}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input field */}
            {receiver && sender && (
                <ChatType
                    receiver={receiver}
                    sender={sender}
                    handleChat={handleChat}
                    setMessage={setMessage}
                    message={message}
                    isConnected={isConnected}
                />
            )}
        </div>
    );
}