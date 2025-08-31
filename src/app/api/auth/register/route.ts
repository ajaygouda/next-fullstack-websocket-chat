import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { User } from "@/models/User";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, email, password, phone, profilePic } = await request.json();
        let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        let cloudinaryRes: any;

        if (profilePic) {
            cloudinaryRes = await cloudinary.uploader.upload(profilePic, {
                folder: "next_FullStack",
            });
        }

        let document = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            profilePic: cloudinaryRes?.secure_url || null,
        });
        return NextResponse.json({ message: "User saved successfully", user: document }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong", error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { username, email, password, phone, profilePic } = await request.json();
        let hashedPassword;

        if (password) {
            hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        }

        let cloudinaryRes: any;

        if (profilePic) {
            cloudinaryRes = await cloudinary.uploader.upload(profilePic, {
                folder: "next_FullStack",
            });
        }
        let existingUser = await User.findOne({ email });
        let document;

        if (existingUser) {
            const updates: any = {
                username,
                phone,
                password: hashedPassword ? hashedPassword : existingUser.password,
                profilePic: cloudinaryRes?.secure_url || null
            };
            document = await User.findByIdAndUpdate(existingUser._id, updates, { new: true });
        }
        const userObj:any = document?.toObject();
        delete userObj.password;

        return NextResponse.json({ message: "User Updated successfully", user: userObj }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong", error: (error as Error).message },
            { status: 500 }
        );
    }
}

