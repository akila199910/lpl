import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";

import { errorHandlerMiddleware } from "./src/middlewares/errorHandlerMiddleware.mjs";

import authRouter from "./src/routes/auth.router.mjs";
import userRouter from "./src/routes/user.route.mjs";
import teamRouter from "./src/routes/team.route.mjs";
import playerRouter from "./src/routes/player.route.mjs";
import bidRouter from "./src/routes/bidRouter.mjs";
import settingRouter from "./src/routes/settingsRouter.mjs";
import auctionRouter from "./src/routes/auctionRouter.mjs";
import overviewRouter from "./src/routes/overview.route.mjs";

import { initSocket } from "./src/utils/socket.js";

import dotenv from "dotenv";
import dashboardRouter from "./src/routes/dashboardRouter.mjs";
import messageRouter from "./src/routes/messageRouter.mjs";
import conversationRouter from "./src/routes/conversationRouter.mjs";

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

console.log("Using env:", env);
console.log("CLIENT_URL:", process.env.CLIENT_URL);


const app = express();
const server = http.createServer(app);

initSocket(server); 

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
console.log("CORS origin:", process.env.CLIENT_URL);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/teams", teamRouter);
app.use("/players", playerRouter);
app.use("/bids", bidRouter);
app.use("/settings", settingRouter);
app.use("/auctions", auctionRouter);
app.use('/overview', overviewRouter)
app.use('/dashboard', dashboardRouter)
app.use('/messages',messageRouter)
app.use('/conversations', conversationRouter)
app.use(errorHandlerMiddleware);

// DB & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch(err => console.log("DB connection error:", err));
