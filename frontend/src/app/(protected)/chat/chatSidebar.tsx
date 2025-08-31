import { IUser } from "@/types/IUser";
import Link from "next/link";

export default function ChatSidebar({ users, receiver, sender, handleSelectUser }: any) {
    return (
        <div className="flex-column text-sm font-medium text-white dark:text-white w-100 bg-blue-400">
            <div className="h-16 flex items-center px-4">
                <h2 className="text-[24px] font-bold">Connect</h2>
            </div>
            {/* <div className="px-4 pb-2">
                <input type="text" placeholder="Search user" id="default-input" className="bg-blue-500 text-white text-sm rounded-full block w-full px-4 py-2 focus-visible:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
            </div> */}
            {users?.map((user: IUser, index: number) => (
                <div key={index} onClick={(e) => handleSelectUser(user)} className={`${receiver?.email === user?.email ? "bg-blue-500" : ""} flex cursor-pointer gap-4 items-center px-4 py-2 active w-full dark:bg-blue-600`} aria-current="page">
                    <img className="object-cover h-12 w-12 bg-gray-100 rounded-full" src={user.profilePic} />
                    <span>{user.username}</span>
                </div>
            ))}
        </div>
    )
}