const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.DATABASE_URL;
if (!uri) throw new Error("DATABASE_URL not set in .env");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    db = client.db(process.env.VITE_USERNAME);
    console.log("Connected to MongoDB, DB:", process.env.VITE_USERNAME);
    return db;
}

function getClient() {
    return client;
}

module.exports = { connectDB, getClient };
