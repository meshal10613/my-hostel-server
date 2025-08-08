require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.VITE_USERNAME}:${process.env.VITE_PASSWORD}@meshal10613.mbbtx0s.mongodb.net/?retryWrites=true&w=majority&appName=meshal10613`;

//middleware
app.use(cors());
app.use(express.json());

// my-hostel
// iwS5cK6448R1sXNW

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get("/", async(req, res) => {
    res.send("Server is running successfully...");
});


// Send a ping to confirm a successful connection
client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");

// Access Database
const database = client.db("my-hostel");

// Access Collection
const usersCollection = database.collection("users");

// usersCollection
app.get("/users", async(req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
});

app.post("/users", async(req, res) => {
    const { email, lastSignInTime } = req.body;
    const existingUser = await usersCollection.findOne({email});
    if(existingUser){
        const query = {email};
        const updatedDoc = {
            $set: {
                lastSignInTime
            }
        };
        const result = await usersCollection.updateOne(query, updatedDoc);
        return res.send(result);
    };
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});