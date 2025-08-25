"use client"
export default function ChatBoardHeader ({receiver}:any){
    return (
        <div className="w-full bg-white h-16 px-4 flex items-center">
             <div className="flex gap-4 items-center">
                <img className="object-cover h-10 w-10 bg-gray-100 rounded-full" src={receiver?.profilePic} />
                <span>{receiver.username}</span>
             </div>
        </div>
    )
}