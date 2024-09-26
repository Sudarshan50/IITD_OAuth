import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: process.env.NODE_ENV === "production" },
};

export default sessionConfig;
