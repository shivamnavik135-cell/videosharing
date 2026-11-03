import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
        origin:process.env.FRONTEND_URL,
        credentials:true
}
))
app.use(express.json({limit:"50kb"}))
app.use(express.urlencoded({extended:true,limit:"50kb"}))
app.use(express.static("public"))

//importing routes
import userRoutes from "./routes/user.routes.js";

//declaring routes
app.use("/api/v1/user",userRoutes)


export { app };