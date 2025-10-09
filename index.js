require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const app = express();
const port = process.env.port || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.VITE_USERNAME}:${process.env.VITE_PASSWORD}@meshal10613.mbbtx0s.mongodb.net/?retryWrites=true&w=majority&appName=meshal10613`;

//middleware
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

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
const mealsCollection = database.collection("meals");

// usersCollection
app.get("/users", async(req, res) => {
    const result = await prisma.user.findMany();
    res.json(result);
});

app.post("/users", async (req, res) => {
    try {
        const { email, displayName, photoURL, badge } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Update lastSignInTime
            const updatedUser = await prisma.user.update({
                where: { email },
                data: { lastSignInTime: new Date() }
            });
            return res.send(updatedUser);
        }

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                email,
                displayName,
                photoURL,
                badge,
                // creationTime will be auto-set by @default(now())
                // lastSignInTime will also be auto-set by @default(now()) and @updatedAt
            }
        });

        res.send(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// mealsCollection
app.get("/meals", async(req, res) => {
    const { category } = req.query;
    if(category){
        const result = await prisma.meal.findMany({
            where: { category: category }
        });
        return res.send(result);
    };
    const result = await prisma.meal.findMany();
    res.json(result);
});

app.get("/mealsFilter", async(req, res) => {
    const { category, search } = req.query;
    const result = await prisma.meal.findMany({
        where: {
            AND: [
            // Search filter
            search
                ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        // { description: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {},

                // Category filter
                category ? { category: category } : {},
            ],
        },
        orderBy: { postTime: "desc" }, // optional: latest first
    });
    res.send(result);
});

app.get("/meals/:id", async(req, res) => {
    const { id } = req.params;
    const result = await prisma.meal.findUnique({
        where: { id: id }
    });
    res.send(result);
});

app.post("/meals", async(req, res) => {
    const {
        title,
        category,
        image,
        description,
        ingredients,
        price,
        distributerName,
        distributerEmail,
    } = req.body;

    // Validate required fields
    if (!title || !category || !image || !description || !ingredients || !price) {
        return res.status(400).json({ error: "Missing required fields" });
    };

    // Save to DB
    const result = await prisma.meal.create({
        data: {
            title,
            category,
            image,
            description,
            ingredients, // String[]
            price: price,
            distributerName,
            distributerEmail,
            rating: 0, // default
            reviews: 0, // default
            likes: 0 // default
        },
    });
    res.send(result);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});