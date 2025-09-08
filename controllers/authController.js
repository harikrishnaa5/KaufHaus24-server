import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import sendEmail from "../sendMail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = (user) => {
    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    return token;
};

const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = Date.now() + 5 * 60 * 1000;
    return { otp, expiresIn };
};

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        if (!email) {
            return res.status(401).json({ message: "Email is required" });
        }
        if (!password) {
            return res.status(401).json({ message: "Password is required" });
        }
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword) return res.status(401).json({ message: "Invalid password" });
            const generatedOtp = generateOtp();
            user.otp = generatedOtp.otp;
            user.otpExpires = generatedOtp.expiresIn;
            await sendEmail({
                to: user.email,
                subject: "Your login OTP",
                text: `Your OTP is ${generatedOtp.otp}. It expires in 5 minutes.`,
            });
            await user.save();
            res.status(200).json({ message: "OTP sent to your email" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    },

    verifyOtp: async (req, res) => {
        const { email, otp } = req.body;
        if (!email) {
            return res.status(401).json({ message: "Email is required" });
        }
        if (!otp) {
            return res.status(401).json({ message: "Otp is required" });
        }
        try {
            const user = await userModel.findOne({ email });
            if (!user || !user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            const token = signToken(user);
            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    },

    signup: async (req, res) => {
        console.log("entering inside");
        const { fullName, email, password } = req.body;
        try {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already exists" });
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const generatedOtp = generateOtp();
            await sendEmail({
                to: email,
                subject: "Your login OTP",
                text: `Your OTP is ${generatedOtp.otp}. It expires in 5 minutes.`,
            });
            const user = await userModel.create({
                fullName,
                email,
                password: passwordHash,
                otp: generatedOtp.otp,
                otpExpires: generatedOtp.expiresIn,
            });
            res.status(200).json({ message: "OTP sent to your email", email: user.email });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    },
};

export default authController;
