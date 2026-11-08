
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Middleware
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "50kb"
}));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/v1/user", userRoutes);

export { app };
