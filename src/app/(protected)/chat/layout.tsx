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
        let res: any = localStorage.getItem("auth");
        let loggedUser = JSON.parse(res)
        setSender(loggedUser);

        const fetchUsers = async () => {
            const users = await fetch("http://localhost:3000/api/users", {
                method: "GET",
                credentials: "include",
            });
            const jsonData = await users.json();
            const jsonDataUsers = jsonData.users;
            const userIndex = jsonDataUsers.findIndex((item: any) => item._id === loggedUser._id);
            if (userIndex > -1) {
                const [matched] = jsonDataUsers.splice(userIndex, 1);
                jsonDataUsers.unshift(matched);
            }
            setUsers(jsonDataUsers)
        }
        fetchUsers();

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
                <div className="flex items-center justify-center flex-1">
                    <div className="w-[70%] text-center text-gray-700">
                        <span className="text-center flex justify-center text-gray-300"><svg className="fill-color h-32 w-32" fill='currentColor' focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 6h-1v8c0 .55-.45 1-1 1H6v1c0 1.1.9 2 2 2h10l4 4V8c0-1.1-.9-2-2-2m-3 5V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v13l4-4h9c1.1 0 2-.9 2-2"></path></svg></span>
                        <h1 className="text-[32px]">The Internet: transforming society and shaping the future through chat.</h1>
                        <p>Dave Barry</p>
                    </div>
                </div>
            )}

        </div>
    )
}