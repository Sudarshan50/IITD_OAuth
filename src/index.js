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
import passport from "./config/passport.js";
import tokenRouter from "./routes/token.js";
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
  })
);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());




if (process.env.NODE_ENV == "development") {
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
}

//importing routes
app.use("/admin", adminRouter);
app.use("/oauth", oAuthRouter);
app.use("/token", tokenRouter);

db().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
