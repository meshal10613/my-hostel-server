const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    username: process.env.VITE_USERNAME,
    password: process.env.VITE_PASSWORD,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    ssl_store_id: process.env.SSL_STORE_ID,
    ssl_store_pass: process.env.SSL_STORE_PASS,
    client_url: process.env.CLIENT_URL,
    server_url: process.env.SERVER_URL,
    payment_secret_key: process.env.PAYMENT_SECRET_KEY,
    nodemailer_email: process.env.NODEMAILER_EMAIL,
    nodemailer_email_pass: process.env.NODEMAILER_EMAIL_PASS,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in:process.env.JWT_EXPIRES_IN
};

module.exports = config;
