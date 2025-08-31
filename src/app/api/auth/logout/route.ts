import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({ message: "Logged out successfully", status: 200 });

        // Clear the token cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), 
        });

        return response
    }
    catch (error) {
        return NextResponse.json(
            { message: "Something went wrong!", error: (error as Error).message },
            { status: 500 }
        );
    }
}
