"use client"

import { useEffect, useState } from "react";
import ChatSidebar from "./chatSidebar";
import { IUser } from "@/types/IUser";
import CharBoard from "./chatBoard";

export default function ChatLayout() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [receiver, setReceiver] = useState<IUser>();
    const [sender, setSender] = useState<IUser>();

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await fetch("http://localhost:3000/api/users", {
                method: "GET",
                credentials: "include",
            });
            const jsonData = await users.json();
            setUsers(jsonData.users)
        }
        fetchUsers();
        const res: any = localStorage.getItem("auth");
        setSender(JSON.parse(res))
    }, [])

    const handleSelectUser = (user: IUser) => {
        setReceiver(user)
    }

    return (
        <div className="flex h-full">
            <ChatSidebar users={users} receiver={receiver} sender={sender} handleSelectUser={handleSelectUser} />
            {receiver?._id && sender?._id ? (
                <CharBoard receiver={receiver} sender={sender} />
            ) : (
                <p>Select a user to start chat</p>
            )}

        </div>
    )
}