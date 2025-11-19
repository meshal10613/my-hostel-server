require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Prisma Client
const prisma = new PrismaClient();

// MongoDB URI from env
const uri = process.env.DATABASE_URL;
if (!uri) throw new Error("DATABASE_URL not set in .env");

// MongoClient with stable API
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db = null;

async function connectDB() {
    if (db) return db;
    await client.connect();
    db = client.db(process.env.VITE_USERNAME || "my-hostel");
    console.log("Connected to MongoDB, DB:", db.databaseName);
    return db;
}

function getClient() {
    return client;
}

module.exports = { prisma, connectDB, getClient };
