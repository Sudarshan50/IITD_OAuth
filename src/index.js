//initilase basic express server with all the required middlewares use import...
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./lib/db.js";
import adminRouter from "./routes/auth.js";
import oAuthRouter from "./routes/oAuth.js";
import session from "express-session";
import methodOverride from "method-override";
import { connectToRedis } from "./lib/redis.js";
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);



app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);



//importing routes
app.use("/api/admin", adminRouter);
app.use("/api/auth", oAuthRouter);



connectToRedis();
db().then(() => {
  // Only listen on port when not in Vercel (for local development)
  if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});

// Export the Express app for Vercel serverless
export default app;
