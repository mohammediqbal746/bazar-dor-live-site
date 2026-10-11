import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// MongoDB ক্লায়েন্ট সেটআপ
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("bazardor"); 

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
});