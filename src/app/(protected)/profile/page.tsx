"use client";

import { useEffect, useState } from "react";

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [file, setFile] = useState<any>(null);
    const [preview, setPreview] = useState<any>(null);

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

    console.log(user)
    // Handle save/update
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const form = {
            email: user.email,
            password: user.password,
            userName: user.userName,
            phone: user.phone,
            image: file, // Base64 string
        };

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.status === 200) {
                console.log("User updated/registered successfully!");
                localStorage.setItem("auth", JSON.stringify(data.user));
                setUser(data.user);
                setFile(null)
                setPreview(null)
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Network or fetch error:", err);
        }
    };

    return (
        <div>
            <h1 className="text-[36px] font-bold mb-6">Profile</h1>
            <div className="flex gap-6">
                <div>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center h-48 w-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
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
                </div>

                <div>
                    <h2 className="text-[24px] font-bold">{user?.username}</h2>
                    <h3>{user?.email}</h3>
                    <h4>{user?.phone}</h4>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={!file}
                className={`mt-4 px-4 py-2 rounded ${file ? "bg-blue-700 text-white cursor-pointer" : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
            >
                Save
            </button>
        </div>
    );
};

export default ProfilePage;
