import nodemailer from "nodemailer";
import config from "./config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.mail.email,
        pass: config.mail.pass,
    },
});

export default transporter;
