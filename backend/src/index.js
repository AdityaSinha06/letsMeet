import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import {createServer} from "node:http";
import {connectToSocket} from "./controllers/socketManager.js";
import cors from "cors"; 

import UserRouter from "./routes/usersRoute.js"

dotenv.config();
const PORT = process.env.PORT || 8000;
const uri = process.env.MONGO_URL;

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const main = async () => {
    await mongoose.connect(uri)
        .then((res) => console.log("DB connection success"))
        .catch((err) => console.log(err.message))
};

app.use(cors());
app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({limit: "40kb" , extended: true}));

app.use("/user" , UserRouter);

server.listen(PORT , () => {
    console.log(`Server is listening at port : ${PORT}`);
    main();
});