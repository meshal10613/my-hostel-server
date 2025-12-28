import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/config.js";
import bcrypt from "bcryptjs";

const startServer = async () => {
    await connectDB();

    app.listen(config.port, () => {
        console.log(
            `🚀 Server running on port http://localhost:${config.port}`
        );
    });
};

startServer();
