"use client"

import { IUser } from "@/types/IUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const router = useRouter();
    const [form, setForm] = useState<any>({
        email: "",
        password: ""
    })
    const [isvalidate, setIsValidate] = useState<boolean>(false)

    const formvalidate = (data: IUser) => {
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            return false
        }
        if (!data.password || data.password.length < 6) {
            return false
        }
        return true
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value }
        setForm(updatedForm);
        setIsValidate(formvalidate(updatedForm))
    }

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form), // <-- stringify the form object
            });

            const data = await res.json(); // parse response
            if (data.status === 200) {
                localStorage.setItem("auth", JSON.stringify(data.user));
                router.push("/chat");
            } else {
                console.log("Something went wrong");
            }
        } catch (err) {
            console.error("Network or fetch error:", err);
        }
    };

    return (
        <div className="flex item-center h-[100vh] justify-center">
            <form onSubmit={handleLogin} className="flex items-center flex-col justify-center w-[400px]">
                <h1 className="text-[36px]">Login</h1>
                <div className="mb-5 w-[100%]">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email" onChange={(e) => handleChange(e)} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="johndoe@gmail.com" required />
                </div>
                <div className="mb-5 w-[100%]">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" onChange={(e) => handleChange(e)} name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button disabled={!isvalidate} type="submit" className={`${isvalidate ? "cursor-pointer  bg-blue-500 hover:bg-blue-700 text-white" : "bg-gray-200"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center`}>Login</button>
                <p className="py-4 w-full text-right"><Link className="cursor-pointer text-blue-500" href={"/register"}>Forgot Password</Link></p>
                <p className="py-4">Don't have account? <Link className="cursor-pointer text-blue-500" href={"/register"}>Register</Link></p>
            </form>

        </div>
    );
}



export default Login