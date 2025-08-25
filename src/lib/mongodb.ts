import mongoose from "mongoose";
const USERNAME = process.env.MONGODB_USERNAME;
const PASSWORD = process.env.MONGODB_PASSWORD;



const MONGODB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.ennnwrd.mongodb.net/PGDB?retryWrites=true&w=majority`
console.log("MONGODB_URI", MONGODB_URI)
let isConnected = false;

export default async function dbConnect() {
    if (isConnected) return;
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
}