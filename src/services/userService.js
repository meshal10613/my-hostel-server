const config = require("../config/config");
const { prisma } = require("../config/db");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const getUsers = async (search) => {
    if (search) {
        return await prisma.user.findMany({
            where: {
                OR: [
                    { displayName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            },
            orderBy: { creationTime: "desc" },
        });
    }
    return await prisma.user.findMany();
};

const createOrUpdateUser = async (data) => {
    const { email, displayName, photoURL, badge, role } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        const user = await prisma.user.update({
            where: { email },
            data: { lastSignInTime: new Date() },
        });
        return { user, message: "Login successfully" };
    }

    const user = await prisma.user.create({
        data: { email, displayName, photoURL, badge, role },
    });
    return { user, message: "Signup successfully" };
};

const makeAdmin = async (id) => {
    return await prisma.user.update({
        where: { id },
        data: { role: "admin" },
    });
};

const updateBadge = async (email, badge) => {
    return await prisma.user.update({
        where: { email },
        data: { badge },
    });
};

const forgetPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return "No account found with this email";
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
        where: { email },
        data: {
            resetOtp: otp,
            resetOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.nodemailer_email,
            pass: config.nodemailer_email_pass,
        },
    });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #333; text-align: center;">Your One-Time Password</h2>
            <p style="">Dear ${user?.displayName},</p>
            <p>Here is your One-Time Password to securely log in to your FoodWagon account:</p>
            <p style="font-size: 24px; font-weight: bold; color: #0d6efd; text-align: center;">${otp}</p>
            <p style="color: #555;">Note: This OTP is valid for 5 minutes.</p>
            <p>If you did not request this OTP, please disregard this email or contact our support team.</p>
            <p style="margin-top: 20px;">Team FoodWagon.</p>
        </div>
    `;

    await transporter.sendMail(
        {
            from: config.nodemailer_email,
            to: email,
            subject: "OTP for FoodWagon Login",
            html: htmlContent,
        },
        (err, info) => {
            if (err) {
                console.error(err);
                return "Failed to send OTP email";
            }
        }
    );
    return { user, otp };
};

const verifyOtp = async (email, otp) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.resetOtp !== otp.toString()) {
        return { status: 404, message: "Invalid OTP" };
    }

    // Check expiry
    if (user.resetOtpExpires < Date.now()) {
        return { status: 410, message: "OTP expired" };
    }

    return { message: "OTP verified" };
};

const resetPassword = async (email, newPassword) => {
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashed,
            resetOtp: null,
            resetOtpExpires: null,
        },
    });

    return { status: 200, message: "Password reset successfully" };
};

module.exports = {
    getUsers,
    createOrUpdateUser,
    makeAdmin,
    updateBadge,
    forgetPassword,
    verifyOtp,
    resetPassword
};
