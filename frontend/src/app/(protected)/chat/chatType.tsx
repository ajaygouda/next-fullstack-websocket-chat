"use client"

import { IMessage } from "@/types/IMessage";
import { useState } from "react"

export default function ChatType({ receiver, sender, handleChat, setMessage, message, isConnected }: any) {

    return (
        <div className="relative mx-4 mb-4">
            <input onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleChat(message); // your event handler
                }
            }} value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type a message" disabled={!isConnected} id="default-input" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full block w-full px-5 py-4 focus-visible:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
            <button disabled={!isConnected || !message.trim()} onClick={() => handleChat(message)} type="button" className={`${message === "" ? "text-gray-500 bg-gray-200" : "text-white bg-blue-500"} absolute cursor-pointer top-0 m-[9px] right-0 text-white font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center`}>
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </button>
        </div>
    )
}