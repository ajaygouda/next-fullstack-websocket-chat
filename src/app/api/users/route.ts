import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";

export async function GET() {

  const cookieStore:any = cookies();
  const token = cookieStore.get("token")?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
    const loggedInUserId = decoded._id;
    try {
        // now you can query users
        const users = await User.find({ _id: { $ne: loggedInUserId } });

        return Response.json({ loggedInUserId, users });
    } catch (error) {
        return Response.json({ message: "Invalid token" }, { status: 401 });
    }
}
