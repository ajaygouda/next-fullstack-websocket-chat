'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems = [
    { name: 'Chat', path: '/chat', icon: "M20 6h-1v8c0 .55-.45 1-1 1H6v1c0 1.1.9 2 2 2h10l4 4V8c0-1.1-.9-2-2-2m-3 5V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v13l4-4h9c1.1 0 2-.9 2-2" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>();

    useEffect(() => {
        let ls: any = localStorage?.getItem("auth");
        if (ls && ls !== "undefined") {
            setUser(JSON.parse(ls));
        } else {
            setUser(null); // or keep default state
        }


    }, [])

    return (
        <aside className="bg-blue-700 shadow-md w-16 flex justify-between flex-col">
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index} className='w-16 h-16 flex justify-center items-center'>
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`block p-2 text-white rounded-lg h-10 w-10 hover:bg-blue-400 ${pathname === item.path ? 'bg-blue-500 font-semibold' : ''
                                }`}
                        >
                            <svg className="fill-color" fill='currentColor' focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d={item.icon}></path></svg>
                            {/* {item.name} */}
                        </Link>
                    </li>
                ))}
            </ul>
            {user && (
                <div className='w-14 h-14 flex items-center justify-center'>
                    <Link href={"/profile"}>
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-8 h-8 object-cover rounded-full" />
                        ) : (
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full" >{user.username.split(" ").map((item: String) => item.charAt(0)).join("")}</div>
                        )}
                    </Link>
                </div>
            )}
        </aside>
    );
}
