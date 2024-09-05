import e from "express";
import admin from "../controllers/adminController.js";

const adminRouter = e.Router();

adminRouter.post("/register", admin.register);

export default adminRouter;
