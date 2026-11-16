import express from "express";
import {userRouter} from "./routers/user-router";
import {fruitRouter} from "./routers/fruit-router";
import cors from "cors"
import {DB} from "./database/db";
const app = express();
new DB(true);

app.use(express.json());
app.use(cors());
app.use("/api", userRouter);
app.use("/api", fruitRouter);



app.listen(3000,  () => {
    console.log("Server is running on port 3000");
    console.log("http://localhost:3000");
})