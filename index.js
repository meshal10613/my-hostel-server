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
    const { search } = req.query;
    if(search){
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { displayName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            },
            orderBy: {
                creationTime: "desc", // optional
            },
        });

        return res.json(users);
    }
    const result = await prisma.user.findMany();
    res.json(result);
});

app.post("/users", async (req, res) => {
    try {
        const { email, displayName, photoURL, badge, role } = req.body;

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
                role,
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

app.patch("/users/admin/:id", async(req, res) => {
    const { id } = req.params;
    const result = await prisma.user.update({
        where: { id },
        data: { role: "admin" },
    });
    res.send(result);
});

// mealsCollection
app.get("/meals", async(req, res) => {
    const { category } = req.query;
    const meals = await prisma.meal.findMany({
        where: category ? { category } : {},
        include: { reviews: true }
    });

    // calculate avg rating with reduce
    const result = meals.map(meal => {
        const avgRating =
            meal.reviews.length > 0
            ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) /
                meal.reviews.length
            : 0;

        return {
            ...meal,
            rating: parseFloat(avgRating.toFixed(2)) // keep 2 decimals
        };
    });
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
        where: { id: id },
        include: { reviews: true },
    });
    const rating = result.reviews.reduce((sum, r) => sum + r.rating, 0);
    result.rating = rating;
    res.send(result);
});

app.patch("/meals/like/:id", async(req, res) => {
    const { id } = req.params;
    const serverData = req.body;
    const result = await prisma.meal.update({
        where: { id },
        data: { likes: serverData.likes + 1 },
    });
    const createLikes = await prisma.likes.create({
        data: {
            mealId: id,
            userName: serverData.userName,
            userEmail: serverData.userEmail
        }
    });
    console.log(createLikes)
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
            reviews: [], // default
            likes: 0 // default
        },
    });
    res.send(result);
});

app.delete("/meals/:id", async(req, res) => {
    const { id } = req.params;
    const result = await prisma.meal.delete({
        where: { id: id }
    });
    res.send(result);
});

//likesCollection
app.get("/likes/:id", async(req, res) => {
    const { id } = req.params;
    const { q } = req.query;
    const mealId = id;
    const userEmail = q;

    const result = await prisma.likes.findFirst({
        where: {
            AND: [
                { mealId },
                { userEmail }
            ]
        }
    });
    res.send(result);
});

//ratingsCollection
app.get("/ratings", async(req, res) => {
    const result = await prisma.rating.findMany();
    res.send(result);
});

app.get("/ratings/:mealId", async(req, res) => {
    const { mealId } = req.params;
    const result = await prisma.rating.findMany({
        where: { mealId }
    });
    res.send(result);
});

app.post("/ratings", async(req, res) => {
    try{
        const {
            mealId,
            rating,
            review,
            ratingUserName,
            ratingUserEmail,
            ratingUserPhotoURL
        } = req.body;

        // Check if this user already reviewed this meal
        const isExist = await prisma.rating.findFirst({
            where: {
                AND: [{ mealId }, { ratingUserEmail }],
            },
        });

        let result;
        let action; // "created" or "updated"

        if (isExist) {
            // ✅ Update existing rating & review
            result = await prisma.rating.update({
                where: { id: isExist.id },
                data: {
                    rating,
                    review,
                    ratingUserName,
                    ratingUserPhotoURL,
                },
            });
            action = "updated";
        } else {
            // ✅ Create new rating
            result = await prisma.rating.create({
                data: {
                    meal: {
                        connect: { id: mealId },
                    },
                    rating,
                    review,
                    ratingUserName,
                    ratingUserEmail,
                    ratingUserPhotoURL,
                },
            });
            action = "created";
        }

        res.json({ success: true, action, data: result });
    }catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});