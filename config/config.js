const dotenv = require("dotenv");
const path = require("path");

dotenv.config({path: path.join(process.cwd(), ".env")});

const config = {
	username: process.env.VITE_USERNAME,
	password: process.env.VITE_PASSWORD,
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
	ssl_store_id: process.env.SSL_STORE_ID,
	ssl_store_pass: process.env.SSL_STORE_PASS
};

module.exports = config;