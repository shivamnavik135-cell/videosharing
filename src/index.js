import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("1. Index.js started");

import { connectDB } from "./db/index.js";
import { app } from "./app.js";

console.log("2. App imported successfully");

connectDB()
    .then(() => {
        console.log("3. Database connected");

        const server = app.listen(8001, () => {
            console.log("4. Server listening on port 8001");
        });

        server.on("request", (req, res) => {
            console.log("5. Incoming request:", req.method, req.url);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });