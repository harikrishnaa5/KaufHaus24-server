import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/authRouter.js";
import connectDB from "./db.js";

const app = express();
const port = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();

        // middlewares
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());

        // routes
        app.use("/auth", authRouter);

        app.listen(port, () => {
            console.log(`Listening at port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
