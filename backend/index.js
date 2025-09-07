
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js"
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js";
import { sendMessage } from "./controllers/messageController.js";
const app=express();
dotenv.config({})
const PORT=process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute);







app.listen(PORT,()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}`);
})


