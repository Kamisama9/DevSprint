import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.js"
const app = express();
configDotenv();
app.use(bodyParser.json());
app.use(cors('https://localhost:5173/'));
const PORT = process.env.PORT||8000;


app.use('/v1',authRouter)
app.get("/", (req, res) => {
  res.send("<h1>Hi, I am the backend!!</h1>");
});
app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
