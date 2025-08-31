"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ProfilePage = () => {
    const [user, setUser] = useState<any>({});
    const [file, setFile] = useState<any>(null);
    const [preview, setPreview] = useState<any>(null);
    const [editType, setEditType] = useState<any>("");
    const router = useRouter()

    // Load user from localStorage
    useEffect(() => {
        const ls = localStorage.getItem("auth");
        if (ls) setUser(JSON.parse(ls));
    }, []);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile: any = e.target.files?.[0];
        setPreview(URL.createObjectURL(selectedFile));
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string; // e.g., "data:image/png;base64,..."
                setFile(base64String);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    useEffect(() => {
        if (file !== null) {
            handleSave()
        }
    }, [file])

    // Handle save/update
    const handleSave = async () => {
        if (!user) return;
        const form = {
            email: user.email,
            password: user.password,
            username: user.username,
            phone: user.phone,
            profilePic: file ? file : user.profilePic, // Base64 string
        };
        if (!user.password) {
            delete form.password
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.status === 200) {
                localStorage.setItem("auth", JSON.stringify(data.user));
                setFile(null)
                setPreview(null)
                setEditType("")
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Network or fetch error:", err);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            localStorage.removeItem("auth");
            router.push("/login")
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex-column text-sm font-medium text-gray-900 dark:text-white w-72 h-[100vh] bg-gray-200">
            <div className="h-16 flex items-center px-4">
                <h2 className="text-[24px] font-bold">Profile & Settings</h2>
            </div>
            <div className="gap-6 px-4">
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center h-64 w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
                    >
                        {preview ? (
                            <img src={preview} alt="preview" className="h-full object-cover rounded-lg" />
                        ) : user?.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="Profile"
                                className="h-full object-cover rounded-lg"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded-lg">
                                {user?.username?.split(" ").map((n: string) => n[0]).join("")}
                            </div>
                        )}
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="mt-4 text-[14px]">
                    <div className="mb-6">
                        <label className="text-gray-500 mb-3 block">Name</label>
                        <p className="text-[16px] flex items-center justify-between">
                            {editType && editType === "username" ? <input className="border-b border-gray-500 focus-visible:outline-none" onChange={(e) => setUser((prev: any) => ({ ...prev, username: e.target.value }))} name="username" value={user?.username} type="text" /> : user?.username}
                            {editType && editType === "username" ?
                                <span onClick={handleSave} className="h-7 w-7 flex items-center justify-center">
                                    <svg className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 16.2-3.5-3.5a.984.984 0 0 0-1.4 0c-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4a.984.984 0 0 0-1.4 0z"></path></svg>
                                </span> :
                                <span onClick={() => setEditType("username")} className="h-7 w-7 flex items-center justify-center">
                                    <svg className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1q-.15.15-.15.36M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path></svg>
                                </span>
                            }
                        </p>
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-500 mb-3 block">Email</label>
                        <p className="mb-2 text-[16px]">{user?.email}</p>
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-500 mb-3 block">Phone</label>
                        <p className="mb-2 text-[16px]">{user?.phone}</p>
                    </div>
                    <div>
                        <label className="text-gray-500 mb-3 block">New Password</label>
                        <p className="text-[16px] flex items-center justify-between">
                            {editType && editType === "password" ? <input name="password" value={user?.password || ""} type="text" placeholder="******" className="border-b border-gray-500 focus-visible:outline-none" onChange={(e) => setUser((prev: any) => ({ ...prev, password: e.target.value }))} /> : "******"}
                            {editType && editType === "password" ?
                                <span onClick={handleSave} className="h-7 w-7 flex items-center justify-center">
                                    <svg className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 16.2-3.5-3.5a.984.984 0 0 0-1.4 0c-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4a.984.984 0 0 0-1.4 0z"></path></svg>
                                </span> :
                                <span onClick={() => setEditType("password")} className="h-7 w-7 flex items-center justify-center">
                                    <svg className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1q-.15.15-.15.36M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path></svg>
                                </span>
                            }
                        </p>
                    </div>
                </div>

                <button onClick={handleLogout} className={`flex w-full items-center mt-6 gap-2 rounded cursor-pointer text-gray-700 cursor-not-allowed"}`}>
                    <svg className="block h-6 w-6" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5z"></path><path d="m20.65 11.65-2.79-2.79c-.32-.32-.86-.1-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7"></path></svg>
                    <span> Logout</span>
                </button>
            </div>

        </div>
    );
};

export default ProfilePage;
