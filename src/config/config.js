import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,

    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
    },

    payment: {
        secret_key: process.env.PAYMENT_SECRET_KEY,
    },

    nodemailer: {
        email: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_EMAIL_PASS,
    },

    client_url: process.env.CLIENT_URL,
    server_url: process.env.SERVER_URL,
};

export default config;
