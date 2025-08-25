'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [user, setUser] = useState<any>();

    useEffect(() => {
        let ls: any = localStorage?.getItem("auth");
        if (ls && ls !== "undefined") {
            setUser(JSON.parse(ls));
        } else {
            setUser(null); // or keep default state
        }


    }, [])

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            const data = await res.json();
            console.log(data.message);
            // Redirect to login page
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <header className="flex items-center justify-between px-6 py-3.5 bg-white shadow">
            <div className="text-lg font-bold">My App</div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleLogout}
                    className="cursor-pointer px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                    Logout
                </button>
                {user && (
                    <Link href={"/profile"}>
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-8 h-8 object-cover rounded-full" />
                        ) : (
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full" >{user.username.split(" ").map((item: String) => item.charAt(0)).join("")}</div>
                        )}
                    </Link>
                )}
            </div>

        </header>
    );
}
