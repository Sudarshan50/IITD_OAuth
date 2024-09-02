//initilase basic express server with all the required middlewares use import...
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./lib/db.js";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV == "development") {
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
}


db().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
