import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: any) {
    try {
        await dbConnect();
        console.log("✅ DB Connected inside register");
        const { email, password } = await request.json();

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields", status: 400 }, { status: 400 });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found", status: 404 }, { status: 404 })
        }

        // Compare password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }


        const token = jwt.sign(
            { id: user._id, email: user.email, userName: user.username, phone: user.phone },
            process.env.JWT_SECRET || "JWT_SECRET",
            { expiresIn: "1h" }
        );
        
        let userObj:any;
        if (user) {
            userObj = user.toObject();;
            delete userObj.password
        }


        const response = NextResponse.json({ status: 200, user: userObj, message: "Login successful" });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60, // 1 hour
        });
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "❌ DB Connection Failed", error: (error as Error).message },
            { status: 500 }
        );
    }
}
