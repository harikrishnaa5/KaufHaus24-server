import express from "express";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/signup", authController.signup)

export default authRouter;
